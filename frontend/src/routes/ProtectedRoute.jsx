import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/Permission";

export const ProtectedRoute = ({ permission, children }) => {
    const { user } = useAuth();

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but no permission
    if (permission && !hasPermission(user, permission)) {
        return <Navigate to="/noPage" replace />;
    }

    // Allowed
    return children;
};