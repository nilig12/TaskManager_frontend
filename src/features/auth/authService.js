import axios from "axios"

const API_URL = process.env.API_URL 

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


export const registerUser = async (userData) => {
    const response = await api.post("/register", userData)
    return response.data;
}

export const loginUser = async (userData) => {
    const response = await api.post("/login", userData)
    return response.data;
}









