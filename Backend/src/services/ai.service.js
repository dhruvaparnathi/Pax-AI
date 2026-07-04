import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, AIMessage, SystemMessage, createAgent } from "langchain";
import { tool } from "@langchain/core/tools";
import { searchInternet } from "./internet.service.js";
import * as z from 'zod';

const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

const microLLM = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
})

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Search the internet for information",
        schema: z.object({
            query: z.string().describe("The query to search the internet for")
        })
    }
);

const extractContentText = (content) => {
    if (typeof content === "string") {
        return content;
    }
    if (Array.isArray(content)) {
        return content
            .map(part => {
                if (typeof part === "string") return part;
                if (part && part.text) return part.text;
                return "";
            })
            .join("");
    }
    if (content && typeof content === "object") {
        if (content.text) return content.text;
    }
    return "";
};

export const generateResponse = async (messages, allImgs) => {
    const today = new Date();
    const systemPromptText = `
        You are a helpful assistant that answers user queries.
        You can response to text and process images as well.
        You can search the internet for information using the searchInternet tool.
        
        IMPORTANT: The current date and time is ${today.toDateString()} (local time: ${today.toLocaleString()}). 
        Use this current date and time as your temporal reference anchor to correctly and accurately answer any questions about today, tomorrow, yesterday, this year, etc.
    `;

    const systemMsg = new SystemMessage(systemPromptText);

    const messagesWithImages = messages.map((msg, index) => {
        const messageImages = (msg.media && msg.media.length > 0)
            ? msg.media.map(m => m.url)
            : (index === messages.length - 1 && allImgs ? allImgs : []);
        return {
            msg,
            images: messageImages || []
        };
    });

    let remainingImageSlots = 8;
    const mappedMessages = [];

    for (let i = messagesWithImages.length - 1; i >= 0; i--) {
        const item = messagesWithImages[i];
        if (item.msg.role === "user") {
            let keepImages = [];
            if (item.images.length > 0 && remainingImageSlots > 0) {
                const sliceCount = Math.min(item.images.length, remainingImageSlots);
                keepImages = item.images.slice(-sliceCount);
                remainingImageSlots -= keepImages.length;
            }

            if (keepImages.length > 0) {
                mappedMessages.unshift(new HumanMessage({
                    content: [
                        { type: "text", text: item.msg.content },
                        ...keepImages.map(imgUrl => ({
                            type: "image_url",
                            image_url: { url: imgUrl }
                        }))
                    ]
                }));
            } else {
                mappedMessages.unshift(new HumanMessage(item.msg.content));
            }
        } else {
            mappedMessages.unshift(new AIMessage(item.msg.content));
        }
    }

    mappedMessages.unshift(systemMsg);

    const dynamicAgent = createAgent({
        model: llm,
        tools: [searchInternetTool],
        systemMessage: systemPromptText
    });

    try {
        const response = await dynamicAgent.invoke({
            messages: mappedMessages,
            input: allImgs && allImgs.length > 0 ? allImgs.join("\n") : ""
        });
        const lastMessage = response.messages[response.messages.length - 1];
        const contentStr = extractContentText(lastMessage.content);
        return contentStr || "I'm sorry, I encountered an issue generating a response.";
    } catch (error) {
        console.warn("Agent search failed, falling back to direct LLM response:", error);
        try {
            const response = await llm.invoke(mappedMessages);
            const contentStr = extractContentText(response.content);
            return contentStr || "I'm sorry, I encountered an issue generating a response.";
        } catch (fallbackError) {
            console.error("Error generating response in fallback:", fallbackError);
            throw fallbackError;
        }
    }
}

export const generateResponseStream = async (messages, allImgs, onToken) => {
    const today = new Date();
    const systemPromptText = `
        You are a helpful assistant that answers user queries.
        You can response to text and process images as well.
        You can search the internet for information using the searchInternet tool.
        
        IMPORTANT: The current date and time is ${today.toDateString()} (local time: ${today.toLocaleString()}). 
        Use this current date and time as your temporal reference anchor to correctly and accurately answer any questions about today, tomorrow, yesterday, this year, etc.
    `;

    const systemMsg = new SystemMessage(systemPromptText);

    const messagesWithImages = messages.map((msg, index) => {
        const messageImages = (msg.media && msg.media.length > 0)
            ? msg.media.map(m => m.url)
            : (index === messages.length - 1 && allImgs ? allImgs : []);
        return {
            msg,
            images: messageImages || []
        };
    });

    let remainingImageSlots = 8;
    const mappedMessages = [];

    for (let i = messagesWithImages.length - 1; i >= 0; i--) {
        const item = messagesWithImages[i];
        if (item.msg.role === "user") {
            let keepImages = [];
            if (item.images.length > 0 && remainingImageSlots > 0) {
                const sliceCount = Math.min(item.images.length, remainingImageSlots);
                keepImages = item.images.slice(-sliceCount);
                remainingImageSlots -= keepImages.length;
            }

            if (keepImages.length > 0) {
                mappedMessages.unshift(new HumanMessage({
                    content: [
                        { type: "text", text: item.msg.content },
                        ...keepImages.map(imgUrl => ({
                            type: "image_url",
                            image_url: { url: imgUrl }
                        }))
                    ]
                }));
            } else {
                mappedMessages.unshift(new HumanMessage(item.msg.content));
            }
        } else {
            mappedMessages.unshift(new AIMessage(item.msg.content));
        }
    }

    mappedMessages.unshift(systemMsg);

    const dynamicAgent = createAgent({
        model: llm,
        tools: [searchInternetTool],
        systemMessage: systemPromptText
    });

    let fullResponse = "";

    try {
        const eventStream = await dynamicAgent.streamEvents({
            messages: mappedMessages,
            input: allImgs && allImgs.length > 0 ? allImgs.join("\n") : ""
        }, { version: "v2" });

        for await (const event of eventStream) {
            if (event.event === "on_chat_model_stream") {
                const chunk = event.data.chunk;
                const contentStr = extractContentText(chunk.content);
                if (contentStr) {
                    fullResponse += contentStr;
                    if (onToken) {
                        onToken(contentStr);
                    }
                }
            }
        }
        return fullResponse || "I'm sorry, I encountered an issue generating a response.";
    } catch (error) {
        console.warn("Agent search stream failed, falling back to direct LLM stream:", error);
        try {
            const responseStream = await llm.stream(mappedMessages);
            for await (const chunk of responseStream) {
                const contentStr = extractContentText(chunk.content);
                if (contentStr) {
                    fullResponse += contentStr;
                    if (onToken) {
                        onToken(contentStr);
                    }
                }
            }
            return fullResponse || "I'm sorry, I encountered an issue generating a response.";
        } catch (fallbackError) {
            console.error("Error generating response in fallback stream:", fallbackError);
            throw fallbackError;
        }
    }
}

export const chatTitleGenerator = async (message) => {
    try {
        const response = await microLLM.invoke([
            new SystemMessage(
                `You are a helpful assistant that generates concise and descriptive titles for given chat conversations.
                - The title should be a short phrase or sentence (maximum 5 words) that captures the main topic of the conversation.
                - The title should be in English, regardless of the language used in the conversation.
                - The title should be engaging and relevant to the content of the conversation.
                - The title should not contain any special characters, emojis, or punctuation marks unless they are essential for clarity.
                - The title should be in sentence case format.
                - You should generate only one title for each conversation.
            `
            ),
            new HumanMessage(`
                Generate title for the following chat conversation:
                ${message}
                `)
        ]);
        console.log("chat Title: ", response.text);
        return response.text;
    } catch (error) {
        console.error("Error generating chat title:", error);
        throw error;
    }
}