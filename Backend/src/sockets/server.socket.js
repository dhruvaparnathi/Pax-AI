import { Server } from 'socket.io';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';
import { chatTitleGenerator, generateResponseStream } from '../services/ai.service.js';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

let io;

const parseCookies = (cookieString) => {
    if (!cookieString) return {};
    return cookieString.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=').map(c => c.trim());
        if (key && value) {
            acc[key] = decodeURIComponent(value);
        }
        return acc;
    }, {});
};

export function initSocket(httpServer) {
    if (!io) {
        io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:5173",
                credentials: true
            }
        });

        // Authentication Middleware for Socket.IO
        io.use(async (socket, next) => {
            try {
                const cookies = parseCookies(socket.handshake.headers.cookie);
                const token = cookies.token;

                if (!token) {
                    return next(new Error("Authentication error: No token provided"));
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await userModel.findById(decoded.id).select("-password");

                if (!user) {
                    return next(new Error("Authentication error: User not found"));
                }

                socket.user = user;
                next();
            } catch (error) {
                return next(new Error("Authentication error: " + error.message));
            }
        });
    }

    io.on('connect', (socket) => {
        console.log('User connected:', socket.id);

        // Listen for new messages sent by this client
        socket.on('send-message', async (data) => {
            const { question, chatId, media } = data;

            try {
                if (!question || !question.trim()) {
                    throw new Error("Message content is required");
                }

                // A. If new chat, generate a title and create the chat document
                let currentChatId = chatId;
                let chat = null;
                if (!currentChatId) {
                    const title = await chatTitleGenerator(question);
                    chat = await chatModel.create({ user: socket.user._id, title });
                    currentChatId = chat._id;
                }

                // B. Save User Message
                const userMsg = await messageModel.create({
                    chat: currentChatId,
                    content: question,
                    role: "user",
                    media: media || []
                });

                if (chat) {
                    socket.emit('chat-created', {
                        chat,
                        userMessage: userMsg
                    });
                }

                // C. Fetch whole conversation history for context
                const history = await messageModel.find({ chat: currentChatId });

                let fullResponseText = "";

                // Stream the response using the helper function in ai.service
                await generateResponseStream(
                    history,
                    (media || []).map(img => img.url),
                    (token) => {
                        fullResponseText += token;

                        // Emit the token to the frontend client in real-time
                        socket.emit('ai-token', {
                            chatId: currentChatId,
                            token: token
                        });
                    }
                );

                // Save the full response in MongoDB
                const aiMsg = await messageModel.create({
                    chat: currentChatId,
                    content: fullResponseText,
                    role: "ai"
                });

                // Emit completion confirmation with final DB records
                socket.emit('message-completed', {
                    chatId: currentChatId,
                    messages: [userMsg, aiMsg],
                    chat: chat
                });

            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
}
