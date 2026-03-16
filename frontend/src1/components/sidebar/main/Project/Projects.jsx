import React, { useState } from "react";
import "./Projects.css";
import { useProjects } from "../../../hooks/useProjects";

export const Projects = () => {
  const {
    projects,
    showForm,
    setShowForm,
    addProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    team: "",
    status: "",
  });

  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      updateProject(editId, formData);
      setEditId(null);
    } else {
      addProject(formData);
    }

    setFormData({
      name: "",
      description: "",
      team: "",
      status: "",
    });

    setShowForm(false);
  };

  const handleEdit = (project) => {
    setFormData(project);
    setEditId(project.id);
    setShowForm(true);
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>Project Portfolio</h2>
        <button onClick={() => setShowForm(true)} className="new-btn">
          New Project
        </button>
      </div>

      {showForm && (
        <form className="project-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Project Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            name="team"
            placeholder="Assigned Team"
            value={formData.team}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>

          <button type="submit" className="add-btn">
            {editId ? "Update Project" : "Add Project"}
          </button>
        </form>
      )}

      <table className="projects-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Team</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan="5" align="center">
                No Projects Added
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{project.team}</td>
                <td>{project.status}</td>
                <td>
                  <button
                    className="update-btn"
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};