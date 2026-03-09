import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask } from "../../api/taskApi";
import { getStaff } from "../../api/staffApi";

export const Task = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, staffData] = await Promise.all([getTasks(), getStaff()]);

        // Normalize tasks: ensure assignedTo is always array of IDs
        const normalizedTasks = tasksData.map(task => ({
          ...task,
          assignedTo: task.assignedTo?.map(s => s._id || s) || [],
        }));

        setTasks(normalizedTasks);
        setStaffList(staffData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getStaffNames = (assignedTo) => {
    if (!Array.isArray(assignedTo) || assignedTo.length === 0) return "None";

    return assignedTo
      .map((id) => {
        const staff = staffList.find((s) => (s._id || s).toString() === id.toString());
        return staff ? staff.name : "Unknown";
      })
      .join(", ");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        setTasks(prev => prev.filter(t => t._id !== id));
      } catch (error) {
        console.error("Failed to delete task", error);
        alert("Failed to delete task");
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Task Management</h1>
        <button className="btn-primary" onClick={() => navigate("create")}>
          Create Task
        </button>
      </div>

      <div className="admin-card">
        {tasks.length === 0 ? (
          <p className="no-data">No tasks found. Create one to get started.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Created By</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.description}</td>
                  <td>{t.createdBy}</td>
                  <td>{getStaffNames(t.assignedTo)}</td>
                  <td>
                    <span className={`status-badge ${t.status === "Completed" ? "active" : "inactive"}`}>
                      {t.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    <button className="btn-secondary" onClick={() => navigate(`update/${t._id}`)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(t._id)} style={{ marginLeft: "8px" }}>Delete</button>
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