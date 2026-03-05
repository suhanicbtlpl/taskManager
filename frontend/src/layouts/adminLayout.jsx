import React from 'react'
import { Sidebar } from '../components/sidebar/Sidebar'
import { Outlet } from "react-router-dom";

function AdminLayout() {
    return (
        <div className='app-layout'>
            <Sidebar />
            <div className='main-content'>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout