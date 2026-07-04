import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { sendMessage, getChats, getChatMessages, deleteChat, uploadFiles } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.post('/send', authMiddleware, upload.any(), sendMessage);
chatRouter.post('/upload', authMiddleware, upload.any(), uploadFiles);
chatRouter.get('/get-chats', authMiddleware, getChats);
chatRouter.get('/get-chat-messages/:chatId', authMiddleware, getChatMessages);
chatRouter.delete('/delete-chat/:chatId', authMiddleware, deleteChat);

export default chatRouter;