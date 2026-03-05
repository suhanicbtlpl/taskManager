import api from "./axios";

export const getTasks = async () => {
    const response = await api.get("/admin/getTasks");
    return response.data;
};

export const createTask = async (data) => {
    const response = await api.post("/admin/createTask", data);
    return response.data;
};

export const updateTask = async (id, data) => {
    const response = await api.put(`/admin/updateTask/${id}`, data);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await api.delete(`/admin/deleteTask/${id}`);
    return response.data;
};
