import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects , deleteProject} from "../api/project";

export const Project = () => {
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjectList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        setProjectList((prev) =>
          prev.filter((p) => p._id !== id && p.id !== id)
        );
      } catch (error) {
        console.error("Failed to delete project", error);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Project Management</h1>

        <button
          className="btn-primary"
          onClick={() => navigate("create")}
        >
          Create Project
        </button>
      </div>

      <div className="admin-card">
        {projectList.length === 0 ? (
          <p>No project added yet</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Assigned Staff</th>
                <th>Tasks</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {projectList.map((item) => (
                <tr key={item._id || item.id}>
                  <td>{item.name}</td>

                  <td>
                    {item.assignedStaff?.length || 0} Persons
                  </td>

                  <td>
                    {item.tasks?.length || 0} Tasks
                  </td>

                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        navigate(`update/${item._id || item.id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn-danger"
                      style={{ marginLeft: "8px" }}
                      onClick={() =>
                        handleDelete(item._id || item.id)
                      }
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