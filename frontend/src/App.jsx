import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Projects from './pages/Projects';
import Staff from './pages/Staff';
import Roles from './pages/Roles';
import Tasks from './pages/Tasks';
import Permissions from './pages/Permissions';
import Documents from './pages/Documents';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from "./pages/Dashboard";

const ProtectedRoute = ({ children, resource, action }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    // Admin bypass: If user role is 'Admin', they have all permissions
    if (user.role?.roleName === 'Admin') {
        return children;
    }

    // RBAC check: resource and action
    if (resource && action) {
        const permissions = user.role?.permissions || [];
        const resourcePermission = permissions.find(p => p.name === resource);
        const hasPermission = resourcePermission?.actions?.includes(action);
        
        if (!hasPermission) return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={
                        <ProtectedRoute resource="dashboard" action="read">
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="projects" element={
                        <ProtectedRoute resource="Project" action="read">
                            <Projects />
                        </ProtectedRoute>
                    } />
                    <Route path="roles" element={
                        <ProtectedRoute resource="Role" action="read">
                            <Roles />
                        </ProtectedRoute>
                    } />
                    <Route path="permissions" element={
                        <ProtectedRoute resource="Permission" action="read">
                            <Permissions />
                        </ProtectedRoute>
                    } />
                    <Route path="staff" element={
                        <ProtectedRoute resource="Staff" action="read">
                            <Staff />
                        </ProtectedRoute>
                    } />
                    <Route path="tasks" element={
                        <ProtectedRoute resource="Task" action="read">
                            <Tasks />
                        </ProtectedRoute>
                    } />
                    <Route path="documents" element={
                        <ProtectedRoute resource="Document" action="read">
                            <Documents />
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
