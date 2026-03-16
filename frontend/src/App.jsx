import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Staff from './pages/Staff';
import Roles from './pages/Roles';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import AdminLayout from './layouts/AdminLayout';
const ProtectedRoute = ({ children, requiredPermission }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    if (requiredPermission && 
        user.role.roleName !== 'Admin' && 
        !user.role.permissions.includes(requiredPermission)) {
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="staff" element={
                        <ProtectedRoute requiredPermission="VIEW_STAFF">
                            <Staff />
                        </ProtectedRoute>
                    } />
                    <Route path="roles" element={
                        <ProtectedRoute requiredPermission="VIEW_ROLE">
                            <Roles />
                        </ProtectedRoute>
                    } />
                    <Route path="projects" element={
                        <ProtectedRoute requiredPermission="VIEW_PROJECT">
                            <Projects />
                        </ProtectedRoute>
                    } />
                    <Route path="tasks" element={
                        <ProtectedRoute requiredPermission="VIEW_TASK">
                            <Tasks />
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
