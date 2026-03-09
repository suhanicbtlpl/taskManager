import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTasks, createTask, updateTask } from "../../api/taskApi";
import { getStaff } from "../../api/staffApi";

export const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: [],
    status: "Pending",
  });

  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffData = await getStaff();
        setStaffList(staffData || []);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();

    if (isEdit) {
      const fetchTask = async () => {
        try {
          const taskList = await getTasks();
          const existing = taskList.find((t) => t._id === id);

          if (existing) {
            setForm({
              title: existing.title,
              description: existing.description,
              assignedTo: existing.assignedTo?.map((s) => s._id || s) || [],
              status: existing.status || "Pending",
            });
          }

        } catch (error) {
          console.error("Error fetching task:", error);
        }
      };

      fetchTask();
    }

  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignChange = (staffId) => {
    setForm((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(staffId)
        ? prev.assignedTo.filter((id) => id !== staffId)
        : [...prev.assignedTo, staffId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      assignedTo: form.assignedTo, // always array of staff IDs
      status: form.status,
      createdBy: user.name,
    };

    try {
      if (isEdit) {
        await updateTask(id, payload);
      } else {
        await createTask(payload);
      }

      navigate("/task");
    } catch (error) {
      console.error("Failed to save task", error);
      alert("Failed to save task");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{isEdit ? "Update Task" : "Create Task"}</h1>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Task Title</label>
            <input name="title" type="text" value={form.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Assign Staff</label>
            {staffList.map((staff) => (
              <div key={staff._id}>
                <input
                  type="checkbox"
                  checked={form.assignedTo.includes(staff._id)}
                  onChange={() => handleAssignChange(staff._id)}
                />
                <label style={{ marginLeft: "6px" }}>{staff.name} ({staff.email})</label>
              </div>
            ))}
            {staffList.length === 0 && <p>No staff found</p>}
          </div>

          <div className="form-group">
            <label>Task Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/task")}>Cancel</button>
            <button type="submit" className="btn-primary">{isEdit ? "Update" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};