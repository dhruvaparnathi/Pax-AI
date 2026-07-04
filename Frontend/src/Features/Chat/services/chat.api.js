import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000/api/chats",
    withCredentials: true,
});

export const sendMessage = async (question, chatId, files = []) => {
    const formData = new FormData();
    formData.append("question", question || "");
    if (chatId) {
        formData.append("chat", chatId);
    }
    if (files && files.length > 0) {
        files.forEach(file => {
            formData.append("image", file);
        });
    }
    const response = await api.post("/send", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const getChats = async () => {
    const response = await api.get("/get-chats");
    return response.data;
}

export const getChatMessages = async (chatId) => {
    const response = await api.get(`/get-chat-messages/${chatId}`);
    return response.data;
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/delete-chat/${chatId}`);
    return response.data;
}

export const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append("image", file);
    });
    const response = await api.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}