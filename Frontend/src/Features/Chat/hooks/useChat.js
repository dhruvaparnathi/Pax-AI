import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getChatMessages, deleteChat, uploadFiles } from "../services/chat.api";
import { useDispatch, useSelector } from "react-redux";
import { 
    setIsLoading, 
    setError, 
    setCurrentChatId, 
    addNewChat, 
    addNewMessage, 
    removeLastMessage,
    setChats, 
    setChatMessages,
    deleteChatFromState 
} from "../chat.slice";

export const useChat = () => {
    const dispatch = useDispatch();
    const { chats, currentChatId, isLoading, error } = useSelector((state) => state.chat);

    async function handleSendMessage({ question, chatId, files = [] }) {
        const socket = initializeSocketConnection();
        if (!socket) return;

        dispatch(setIsLoading(true));
        
        let uploadedMedia = [];
        try {
            if (files && files.length > 0) {
                // 1. Upload files first over HTTP
                const data = await uploadFiles(files);
                uploadedMedia = data.files || [];
            }

            // 2. Format user message media local preview or URLs
            const userMedia = uploadedMedia.length > 0 
                ? uploadedMedia 
                : (files && files.length > 0 
                    ? files.map(file => ({ url: URL.createObjectURL(file), alt: file.name }))
                    : []);

            // 3. Dispatch user message locally if it's an existing chat
            if (chatId) {
                dispatch(addNewMessage({
                    chatId,
                    content: question,
                    role: "user",
                    media: userMedia
                }));
            }

            // 4. Emit socket event
            socket.emit('send-message', {
                question,
                chatId,
                media: uploadedMedia
            });
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message || "An unexpected error occurred.";
            dispatch(setError(errorMsg));
            dispatch(setIsLoading(false));
            throw error;
        }
    }

    async function handleFetchChats() {
        try {
            dispatch(setIsLoading(true));
            const data = await getChats();
            const { chats: fetchedChats } = data;
            
            const formatted = fetchedChats.reduce((acc, c) => {
                acc[c._id] = {
                    _id: c._id,
                    title: c.title,
                    messages: [],
                    lastUpdated: c.updatedAt
                };
                return acc;
            }, {});
            
            dispatch(setChats(formatted));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    }

    async function handleOpenChat(chatId) {
        try {
            dispatch(setIsLoading(true));
            const data = await getChatMessages(chatId);
            const { messages } = data;

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
                media: msg.media
            }));

            dispatch(setChatMessages({ chatId, messages: formattedMessages }));
            dispatch(setCurrentChatId(chatId));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    }

    async function handleDeleteChat(chatId) {
        try {
            dispatch(setIsLoading(true));
            await deleteChat(chatId);
            dispatch(deleteChatFromState(chatId));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    }

    return {
        chats,
        currentChatId,
        isLoading,
        error,
        initializeSocketConnection,
        handleSendMessage,
        handleFetchChats,
        handleOpenChat,
        handleDeleteChat
    };
};