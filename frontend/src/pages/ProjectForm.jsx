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
    assignedStaff: [],
    tasks: []
  });

  useEffect(() => {

    const fetchData = async () => {
      const staffData = await getStaff();
      const taskData = await getTasks();

      setStaffList(staffData);
      setTaskList(taskData);
    };

    fetchData();

  }, []);

  useEffect(() => {

    if (isEdit) {

      const fetchProject = async () => {

        const data = await getProjects();

        const existing = data.find(
          (item) => item._id === id || item.id === Number(id)
        );

        if (existing) {
          setProject({
            ...existing,
            assignedStaff: existing.assignedStaff?.map(s => s._id || s) || [],
            tasks: existing.tasks?.map(t => t._id || t) || []
          });
        }

      };

      fetchProject();
    }

  }, [id, isEdit]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setProject((prev) => ({
      ...prev,
      [name]: value
    }));

  };

//   const handleStaffChange = (e) => {

//     const selected = Array.from(
//       e.target.selectedOptions,
//       (option) => option.value
//     );

//     setProject((prev) => ({
//       ...prev,
//       assignedStaff: selected
//     }));

//   };

  const handleTaskChange = (e) => {

    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setProject((prev) => ({
      ...prev,
      tasks: selected
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (isEdit) {
        await updateProject(id, project);
      } else {
        await createProject(project);
      }

      navigate("/project");

    } catch (error) {
      console.error("Failed to save project", error);
    }

  };

  return (
    <div className="admin-container">

      <div className="admin-header">
        <h1>{isEdit ? "Update Project" : "Create Project"}</h1>
      </div>

      <div className="admin-card">

        <form onSubmit={handleSubmit} className="admin-form">

          <div className="form-group">
            <label>Project Name</label>

            <input
              type="text"
              name="name"
              value={project.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div className="form-group">
            <label>Assign Staff</label>

            <select
              multiple
              value={project.assignedStaff}
              onChange={handleStaffChange}
            >
              {staffList.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div> */}

          <div className="form-group">
  <label>Assign Staff</label>

  {staffList.map((staff) => (
    <div key={staff._id}>
      <input
        type="checkbox"
        value={staff._id}
        checked={project.assignedStaff.includes(staff._id)}
        onChange={(e) => {
          const staffId = e.target.value;

          if (e.target.checked) {
            setProject({
              ...project,
              assignedStaff: [...project.assignedStaff, staffId]
            });
          } else {
            setProject({
              ...project,
              assignedStaff: project.assignedStaff.filter(
                (id) => id !== staffId
              )
            });
          }
        }}
      />

      {staff.name}
    </div>
  ))}
</div>

          <div className="form-group">
            <label>Assign Tasks</label>

            <select
              multiple
              value={project.tasks}
              onChange={handleTaskChange}
            >
              {taskList.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/project")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
            >
              {isEdit ? "Update" : "Create"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};