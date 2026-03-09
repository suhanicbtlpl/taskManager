import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjects, createProject, updateProject } from "../api/project";
import { getStaff } from "../api/staffApi";
import { getTasks } from "../api/taskApi";

export const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [staffList, setStaffList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [project, setProject] = useState({
    name: "",
    description: "",
    assignedStaff: [],
    tasks: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffData, taskData] = await Promise.all([getStaff(), getTasks()]);
        setStaffList(staffData || []);
        setTaskList(taskData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchProject = async () => {
        try {
          const data = await getProjects();
          const existing = data.find((item) => item._id === id);
          if (existing) {
            setProject({
              ...existing,
              assignedStaff: existing.assignedStaff?.map(s => s._id || s) || [],
              tasks: existing.tasks?.map(t => t._id || t) || []
            });
          }
        } catch (err) {
          console.error("Error fetching project:", err);
        }
      };
      fetchProject();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field, itemId) => {
    setProject(prev => {
      const current = prev[field] || [];
      const updated = current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: project.name,
      description: project.description,
      assignedStaff: project.assignedStaff,
      tasks: project.tasks
    };

    try {
      if (isEdit) {
        await updateProject(id, payload);
      } else {
        await createProject(payload);
      }
      navigate("/project");
    } catch (error) {
      console.error("Failed to save project", error);
      alert("Failed to save project. Please check if project name is unique.");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{isEdit ? "Edit Project" : "Create Project"}</h1>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Website Redesign"
              value={project.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Brief overview of the project"
              value={project.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Assign Staff (Team members)</label>
            <div className="checkbox-group">
              {staffList.map((staff) => (
                <label key={staff._id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={project.assignedStaff.includes(staff._id)}
                    onChange={() => handleToggle("assignedStaff", staff._id)}
                  />
                  {staff.name}
                </label>
              ))}
              {staffList.length === 0 && <p className="no-data">No staff members found</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Link Tasks</label>
            <div className="checkbox-group">
              {taskList.map((task) => (
                <label key={task._id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={project.tasks.includes(task._id)}
                    onChange={() => handleToggle("tasks", task._id)}
                  />
                  {task.title}
                </label>
              ))}
              {taskList.length === 0 && <p className="no-data">No tasks found</p>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/project")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};