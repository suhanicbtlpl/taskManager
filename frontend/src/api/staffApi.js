import api from "./axios";

export const getStaff = async () => {
    const response = await api.get("/admin/getStaff");
    return response.data;
};

export const createStaff = async (data) => {
    const response = await api.post("/admin/createStaff", data);
    return response.data;
};

export const updateStaff = async (id, data) => {
    const response = await api.put(`/admin/updateStaff/${id}`, data);
    return response.data;
};

export const deleteStaff = async (id) => {
    const response = await api.delete(`/admin/deleteStaff/${id}`);
    return response.data;
};
