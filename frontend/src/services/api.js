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

export const staffService = {
    getStaff: () => api.get('/staff'),
    createStaff: (data) => api.post('/staff', data),
    updateStaff: (id, data) => api.put(`/staff/${id}`, data),
    deleteStaff: (id) => api.delete(`/staff/${id}`),
};

export const roleService = {
    getRoles: () => api.get('/roles'),
    createRole: (data) => api.post('/roles', data),
    updateRole: (id, data) => api.put(`/roles/${id}`, data),
    deleteRole: (id) => api.delete(`/roles/${id}`),
};

export const projectService = {
    getProjects: () => api.get('/projects'),
    createProject: (data) => api.post('/projects', data),
    updateProject: (id, data) => api.put(`/projects/${id}`, data),
    deleteProject: (id) => api.delete(`/projects/${id}`),
};

export const taskService = {
    getTasks: () => api.get('/tasks'),
    getTasksByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
    createTask: (data) => api.post('/tasks', data),
    updateTask: (id, data) => api.put(`/tasks/${id}`, data),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export default api;
