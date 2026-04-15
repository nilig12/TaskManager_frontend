import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("accessToken")
    console.log(token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config

})

export default api

export const createTask = async (taskData) => {
    const response = await api.post(`/api/tasks/`, taskData);
    return response.data;
}

export const getAllTasks = async () => {
    const response = await api.get(`/api/tasks/`);
    return response.data;
}

export const getTaskById = async (id) => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
}

export const updateTask = async (id, taskData) => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
};



export const deleteTask = async (id) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
}

