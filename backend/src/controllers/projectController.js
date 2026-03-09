const Project = require("../model/Project");


// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("tasks");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, description, tasks } = req.body;

    const project = new Project({
      name,
      description,
      tasks
    });

    const savedProject = await project.save();

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Update Project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};