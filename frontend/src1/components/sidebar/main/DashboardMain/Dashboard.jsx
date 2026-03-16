import React from "react";
import "./Dashboard.css";

export const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome</h1>

      <div className="card-container">
        <div className="dashboard-card">
          <h3>Total Members</h3>
          <p className="card-number">2</p>
          <span className="card-note">(Managers & Staff only)</span>
        </div>

        <div className="dashboard-card">
          <h3>In Progress</h3>
          <p className="card-number">3</p>
          <span className="card-note">Excludes Completed Status</span>

        </div>

         
      </div>
    </div>
  );
};