import React, { useState, useEffect } from "react";
import { getStaff } from "../api/staffApi";
import { getRoles } from "../api/roleApi";
import { getTasks } from "../api/taskApi";

export const Dashboard = () => {
    const [stats, setStats] = useState({
        staff: 0,
        roles: 0,
        tasks: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const staffData = await getStaff();
                const rolesData = await getRoles();
                const tasksData = await getTasks();

                setStats({
                    staff: staffData.length || 0,
                    roles: rolesData.length || 0,
                    tasks: tasksData.length || 0
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="admin-container">
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Total Staff</span>
                    <span className="stat-value">{stats.staff}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Total Role</span>
                    <span className="stat-value">{stats.roles}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Total Task</span>
                    <span className="stat-value">{stats.tasks}</span>
                </div>
            </div>
        </div>
    );
};
