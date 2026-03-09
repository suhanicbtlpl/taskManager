import api from "./axios";

export const getProjects = async () => {
  const res = await api.get("/admin/getProjects");
  return res.data;
};

export const createProject = async (data) => {
  const res = await api.post("/admin/createProject", data);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await api.put(`/admin/updateProject/${id}`, data);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/admin/deleteProject/${id}`);
  return res.data;
};