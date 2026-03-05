import api from "./axios";

export const getRoles = async () => {
    const response = await api.get("/admin/getRoles");
    return response.data;
};

export const createRole = async (data) => {
    const response = await api.post("/admin/createRole", data);
    return response.data;
};

export const updateRole = async (id, data) => {
    const response = await api.put(`/admin/updateRole/${id}`, data);
    return response.data;
};

export const deleteRole = async (id) => {
    const response = await api.delete(`/admin/deleteRole/${id}`);
    return response.data;
};
