import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
const AUTH_URL = `${backendUrl}/api/auth`;

export const authApi = axios.create({
    baseURL: AUTH_URL,
    withCredentials: true
});

export const registerUser = async (data) => {
    try {
        const response = await authApi.post("/register", data);
        return response.data;
    } catch (error) {
        console.error("Error in registerUser:", error.response?.data || error.message);
        throw error;
    }
}

export const loginUser = async (data) => {
    try {
        const response = await authApi.post("/login", data);
        return response.data;
    } catch (error) {
        console.error("Error in loginUser:", error.response?.data || error.message);
        throw error;
    }
}

export const getMe = async () => {
    try {
        const response = await authApi.get("/me");
        return response.data;
    } catch (error) {
        console.error("Error in getMe:", error.response?.data || error.message);
        throw error;
    }
}

export const logoutUser = async () => {
    try {
        const response = await authApi.post("/logout");
        return response.data;
    } catch (error) {
        console.error("Error in logoutUser:", error.response?.data || error.message);
        throw error;
    }
}
