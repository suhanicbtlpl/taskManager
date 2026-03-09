import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getProjects, deleteProject } from "../api/project";

export const Project = () => {
  const navigate = useNavigate();
  const location = useLocation(); // tracks route changes
  const [projectList, setProjectList] = useState([]);

  // Fetch projects from backend
  const fetchData = async () => {
    try {
      const projData = await getProjects();
      const fixedProjData = projData.map((p) => ({
        ...p,
        assignedStaff: Array.isArray(p.assignedStaff) ? p.assignedStaff.map(s => s._id || s) : [],
        tasks: Array.isArray(p.tasks) ? p.tasks.map(t => t._id || t) : [],
      }));
      setProjectList(fixedProjData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fetch on mount AND whenever route changes (like after editing a project)
  useEffect(() => {
    fetchData();
  }, [location]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        setProjectList((prev) => prev.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Failed to delete project", error);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Projects</h1>
        <button className="btn-primary" onClick={() => navigate("create")}>
          Create Project
        </button>
      </div>

      <div className="admin-card">
        {projectList.length === 0 ? (
          <p className="no-data">No projects found. Create one to get started.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Team Size</th>
                <th>Tasks</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {projectList.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: '600' }}>{item.name}</td>

                  {/* Team Size column like Tasks */}
                  <td>
                    <span className="status-badge active">
                      {item.assignedStaff?.length || 0} Persons
                    </span>
                  </td>

                  <td>
                    <span className="status-badge active">
                      {item.tasks?.length || 0} Tasks
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => navigate(`update/${item._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
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