import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/Permission";

export const ProtectedRoute = ({ permission, children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check after user is logged in
    if (!user) return;

    // if (permission && !hasPermission(user, permission)) {
    //     return <Navigate to="/noPage" replace />;
    if (permission && !hasPermission(user, permission)) {
      alert("You don't have permission to access this page");
      navigate(-1);
    }
  }, [user, permission, navigate]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(user, permission)) {
    return null;
  }

  return children;
};