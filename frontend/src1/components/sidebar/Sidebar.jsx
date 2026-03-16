import React from 'react'
import './sidebar.css'
import { Link } from 'react-router-dom'

export const Sidebar = () => {
  return (
    <div className="sidebar">

      <div className="sidebar-item">
        <Link to="/dashboard">Dashboard</Link>
      </div>

      <div className="sidebar-item">
        <Link to="/permissions">Permissions</Link>
      </div>

      <div className="sidebar-item">
        <Link to="/projects">Project</Link>
      </div>

      <div className="sidebar-item">
        <Link to="/roles">Roles</Link>
      </div>

      <div className="sidebar-item">
        <Link to="/staff">Staff</Link>
      </div>

      <div className="sidebar-item">
        <Link to="/tasks">Task</Link>
      </div>

      <div className="sidebar-item">
        <Link to="/task-status">Task Status</Link>
      </div>

    </div>
  )
}