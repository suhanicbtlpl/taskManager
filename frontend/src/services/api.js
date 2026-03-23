import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const { token } = JSON.parse(storedUser);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile'),
};

// Role Service
export const roleService = {
    getRoles: (params) => api.get('/roles', { params }),
    createRole: (data) => api.post('/roles', data),
    updateRole: (id, data) => api.put(`/roles/${id}`, data),
    deleteRole: (id) => api.delete(`/roles/${id}`),
};

// Permission Service
export const permissionService = {
    getPermissions: (params) => api.get('/permissions', { params }),
    createPermission: (data) => api.post('/permissions', data),
    updatePermission: (id, data) => api.put(`/permissions/${id}`, data),
    deletePermission: (id) => api.delete(`/permissions/${id}`),
};

// Staff Service
export const staffService = {
    getStaff: (params) => api.get('/staff', { params }),
    createStaff: (data) => api.post('/staff', data),
    updateStaff: (id, data) => api.put(`/staff/${id}`, data),
    deleteStaff: (id) => api.delete(`/staff/${id}`),
};

// Project Service
export const projectService = {
    getProjects: (params) => api.get('/projects', { params }),
    createProject: (data) => api.post('/projects', data),
    updateProject: (id, data) => api.put(`/projects/${id}`, data),
    deleteProject: (id) => api.delete(`/projects/${id}`),
};

// Task Service
export const taskService = {
    getTasks: (params) => api.get('/tasks', { params }),
    createTask: (data) => api.post('/tasks', data),
    updateTask: (id, data) => api.put(`/tasks/${id}`, data),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
    getTasksByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
};

// Document Service
export const documentService = {
    getDocuments: (params) => api.get('/documents', { params }),
    uploadDocument: (formData) => api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteDocument: (id) => api.delete(`/documents/${id}`),
    downloadDocument: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
};

export default api;
