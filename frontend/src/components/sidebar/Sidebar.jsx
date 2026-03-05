import React from 'react'
import { Link } from 'react-router-dom'
import './sidebar.css'
import { Outlet } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../utils/Permission';
export const Sidebar = () => {
    const { user, logout } = useAuth();
    console.log(user);

    return (
        <div className='sidebar'>
            <Link to='/dashboard'>Dashboard</Link>
            {hasPermission(user, 'VIEW_STAFF') && <Link to='/staff'>Staff</Link>}
            {hasPermission(user, 'VIEW_ROLE') && <Link to='/role'>Role</Link>}
            {hasPermission(user, 'VIEW_TASK') && <Link to='/task'>Task</Link>}
            <button
                onClick={logout}
                className="btn-danger"
                style={{ margin: "1.5rem", marginTop: "auto", border: "1px solid rgba(255,255,255,0.2)" }}
            >
                Logout
            </button>
        </div>
    )
}
