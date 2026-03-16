import { useState } from "react";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addProject = (projectData) => {
    const newProject = {
      id: Date.now(),
      ...projectData,
    };

    setProjects((prev) => [...prev, newProject]);
    setShowForm(false);
  };

  const updateProject = (id, updatedData) => {
    
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, ...updatedData }
          : project
      )
    );
  };

  const deleteProject = (id) => {
    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );
  };

  return {
    projects,
    showForm,
    setShowForm,
    addProject,
    updateProject,
    deleteProject,
  };
};