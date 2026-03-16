import React from "react";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "../components/sidebar/main/DashboardMain/Dashboard";
import { Permissions } from "../components/sidebar/main/Permission/Permissions";
import { Projects } from "../components/sidebar/main/Project/Projects";
import { Role } from "../components/sidebar/main/Roles/Role";
import { Staff } from "../components/sidebar/main/StaffMain/Staff";
import { TaskStatus } from "../components/sidebar/main/TaskStatus/TaskStatus";
import { Task } from "../components/sidebar/main/Task/Task";

export const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/permissions" element={<Permissions/>} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="/roles" element={<Role/>} />
        <Route path="/staff" element={<Staff/>} />
        <Route path="/tasks" element={<TaskStatus/>} />
        <Route path="/task-status" element={<Task/>} />
    </Routes>
  );
};