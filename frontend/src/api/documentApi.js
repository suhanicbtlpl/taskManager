import api from "./axios";

export const getDocuments = async () => {
  const res = await api.get("/admin/getDocuments");
  return res.data;
};

export const createDocument = async (data) => {
  const res = await api.post("/admin/createDocument", data);
  return res.data;
};

export const updateDocument = async (id, data) => {
  const res = await api.put(`/admin/updateDocument/${id}`, data);
  return res.data;
};

export const deleteDocument = async (id) => {
  const res = await api.delete(`/admin/deleteDocument/${id}`);
  return res.data;
};

export const requestDocumentAccess = async (data) => {
  const res = await api.post("/admin/requestDocumentAccess", data);
  return res.data;
};

export const getDocumentRequests = async () => {
  const res = await api.get("/admin/getDocumentRequests");
  return res.data;
};

export const approveDocumentRequest = async (id, grantedPermissions) => {
  const res = await api.put(`/admin/approveDocumentRequest/${id}`, { grantedPermissions });
  return res.data;
};