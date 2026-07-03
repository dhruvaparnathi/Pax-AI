import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getChatMessages, deleteChat } from "../services/chat.api";
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
        let activeId = chatId;
        try {
            dispatch(setIsLoading(true));
            const userMedia = files && files.length > 0
                ? files.map(file => ({ url: URL.createObjectURL(file), alt: file.name }))
                : [];

            dispatch(addNewMessage({ 
                chatId: chatId, 
                content: question, 
                role: "user",
                media: userMedia
            }));
            
            const data = await sendMessage(question, chatId, files);
            const { chat, messages } = data;
            
            if (!chatId && chat) {
                activeId = chat._id;
                dispatch(addNewChat({ chatId: activeId, title: chat.title }));
                dispatch(addNewMessage({ 
                    chatId: activeId, 
                    content: question, 
                    role: "user",
                    media: userMedia
                }));
                dispatch(setCurrentChatId(activeId));
            }

            if (messages && messages.length >= 2) {
                const aiMsg = messages[1];
                dispatch(addNewMessage({ chatId: activeId, content: aiMsg.content, role: aiMsg.role }));
            }
            return activeId;
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message || "An unexpected error occurred.";
            if (activeId) {
                dispatch(removeLastMessage({ chatId: activeId }));
            }
            dispatch(setError(errorMsg));
            throw error;
        } finally {
            dispatch(setIsLoading(false));
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