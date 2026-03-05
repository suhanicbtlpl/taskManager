import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRoles, deleteRole } from "../api/roleApi";

export const Role = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRole(id);
        setRoles((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      } catch (error) {
        console.error("Failed to delete role", error);
        alert("Failed to delete role");
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Roles</h1>
        <button className="btn-primary" onClick={() => navigate("create")}>
          Create Role
        </button>
      </div>

      <div className="admin-card">
        {roles.length === 0 ? (
          <p className="no-data">No roles found. Create one to get started.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Action</th>
                <th>Status</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* <tbody>
              {roles.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.action || "USER"}</td>
                  <td>
                    <span className={`status-badge ${r.status === "Active" ? "active" : "inactive"}`}>
                      {r.status || "Active"}
                    </span>
                  </td>
                  <td>{r.permissions ? r.permissions.length : 0} Perms</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`update/${r.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(r.id)}
                      style={{ marginLeft: "8px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody> */}
            <tbody>
              {roles.map((r) => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>{r.action || "USER"}</td>
                  <td>
                    <span className={`status-badge ${r.status === "Active" ? "active" : "inactive"}`}>
                      {r.status || "Active"}
                    </span>
                  </td>
                  <td>{r.permissions ? r.permissions.length : 0} Perms</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`update/${r._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(r._id)}
                      style={{ marginLeft: "8px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
