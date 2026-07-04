import { createSlice, current } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers:{
        setChats(state,action){
            state.chats = action.payload;
        },
        setCurrentChatId(state,action){
            state.currentChatId = action.payload;
        },
        setIsLoading(state,action){
            state.isLoading = action.payload;
        },
        setError(state,action){
            state.error = action.payload;
        },
        addNewChat(state, action) {
            const { chatId, title } = action.payload;
            state.chats[chatId] = {
                _id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString()
            };
        },
        addNewMessage(state, action) {
            const { chatId, content, role, media } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages.push({ content, role, media });
                state.chats[chatId].lastUpdated = new Date().toISOString();
            }
        },
        removeLastMessage(state, action) {
            const { chatId } = action.payload;
            if (state.chats[chatId] && state.chats[chatId].messages.length > 0) {
                state.chats[chatId].messages.pop();
                state.chats[chatId].lastUpdated = new Date().toISOString();
            }
        },
        setChatMessages(state, action) {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages;
                state.chats[chatId].lastUpdated = new Date().toISOString();
            }
        },
        deleteChatFromState(state, action) {
            const chatId = action.payload;
            delete state.chats[chatId];
            if (state.currentChatId === chatId) {
                state.currentChatId = null;
            }
        },
        updateLastMessageContent(state, action) {
            const { chatId, content } = action.payload;
            if (state.chats[chatId] && state.chats[chatId].messages.length > 0) {
                const messages = state.chats[chatId].messages;
                messages[messages.length - 1].content = content;
                state.chats[chatId].lastUpdated = new Date().toISOString();
            }
        }
    }
});

export const {
    setChats,
    setCurrentChatId,
    setIsLoading,
    setError,
    addNewChat,
    addNewMessage,
    removeLastMessage,
    setChatMessages,
    deleteChatFromState,
    updateLastMessageContent
} = chatSlice.actions;
export default chatSlice.reducer;