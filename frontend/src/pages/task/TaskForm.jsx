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
        assignedTo: "",
        status: "Pending",
    });
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const staffData = await getStaff();
                setStaffList(staffData);
            } catch (error) {
                console.error("Error fetching staff:", error);
            }
        };
        fetchStaff();

        if (isEdit) {
            const fetchTask = async () => {
                try {
                    const taskList = await getTasks();
                    const existing = taskList.find((t) => t._id === id || t.id === Number(id));
                    if (existing) {
                        setForm({
                            title: existing.title,
                            description: existing.description,
                            assignedTo: typeof existing.assignedTo === 'object' ? existing.assignedTo._id : existing.assignedTo,
                            status: existing.status || "Pending",
                        });
                    }
                } catch (error) {
                    console.error("Error fetching tasks:", error);
                }
            };
            fetchTask();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const taskObj = {
            ...form,
            createdBy: user.name, // Record the name of the user who created the task
        };

        try {
            if (isEdit) {
                await updateTask(id, taskObj);
            } else {
                await createTask(taskObj);
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
                        <input
                            name="title"
                            type="text"
                            placeholder="Enter task title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            placeholder="Enter task description"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Assign To (Staff)</label>
                        <select
                            name="assignedTo"
                            value={form.assignedTo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Staff</option>
                            {staffList.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Task Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/task")}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
