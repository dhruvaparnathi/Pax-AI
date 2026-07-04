import { generateResponse, chatTitleGenerator } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { uploadImage } from "../services/storageIMG.service.js";

export const sendMessage = async (req, res) => {
    let userMessage = null;
    let chat = null;
    try {
        const { question, chat: chatId } = req.body;
        const files = req.files;
        let uploadedImageUrl = [];

        if (files && files.length > 0) {
            uploadedImageUrl = await Promise.all(
                files.map(async (file) => {
                    const result = await uploadImage({
                        buffer: file.buffer,
                        fileName: file.originalname,
                        fileType: file.mimetype,
                    });

                    return {
                        url: result.url,
                        alt: file.originalname
                    };
                })
            );
        }

        if ((!question || !question.trim()) && uploadedImageUrl.length === 0) {
            return res.status(400).json({ error: "Question or message is required" });
        }

        const queryText = question && question.trim() ? question : "Analyze this image.";


        let title = null;
        if (!chatId) {
            title = await chatTitleGenerator(queryText);
            chat = await chatModel.create({ user: req.user._id, title });
        }

        userMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: queryText,
            role: "user",
            media: uploadedImageUrl
        });

        const messages = await messageModel.find({
            chat: chatId || chat._id,
        });

        const response = await generateResponse(messages, uploadedImageUrl.map(img => img.url));

        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: response,
            role: "ai",
        });


        return res.status(200).json({
            success: true,
            chat,
            messages: [userMessage, aiMessage],
        });

    } catch (error) {
        if (userMessage) {
            await messageModel.findByIdAndDelete(userMessage._id);
        }
        if (!req.body.chat && chat) {
            await chatModel.findByIdAndDelete(chat._id);
        }
        res.status(500).json({ error: error.message });
    }
}

export const getChats = async (req, res) => {

    const chats = await chatModel.find({ user: req.user._id });

    if (!chats) {
        return res.status(404).json({ error: "No chats found" });
    }

    return res.status(200).json({
        success: true,
        chats,
    });

}

export const getChatMessages = async (req, res) => {

    const { chatId } = req.params;
    const chat = await chatModel.findById(chatId);

    if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
    }

    const messages = await messageModel.find({ chat: chatId });

    if (!messages) {
        return res.status(404).json({ error: "No messages found" });
    }

    return res.status(200).json({
        success: true,
        messages,
    });
}


export const deleteChat = async (req, res) => {

    const { chatId } = req.params;
    const chat = await chatModel.findById(chatId);

    if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
    }

    await chatModel.findByIdAndDelete(chatId);

    await messageModel.deleteMany({ chat: chatId });

    return res.status(200).json({
        success: true,
        message: "Chat deleted successfully",
    });
}

export const uploadFiles = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const uploadedImages = await Promise.all(
            files.map(async (file) => {
                const result = await uploadImage({
                    buffer: file.buffer,
                    fileName: file.originalname,
                    fileType: file.mimetype,
                });

                return {
                    url: result.url,
                    alt: file.originalname
                };
            })
        );

        return res.status(200).json({
            success: true,
            files: uploadedImages
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}