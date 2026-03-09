const Project = require("../model/Project");


// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("tasks")
      .populate("assignedStaff", "name email");

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
      tasks,
      assignedStaff: req.body.assignedStaff || []
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
    const { _id, __v, ...updateData } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("tasks").populate("assignedStaff", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Toggle staff assignment for a project
exports.updateProjectStaff = async (req, res) => {
  try {
    const { staffId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Initialize assignedStaff if missing
    if (!Array.isArray(project.assignedStaff)) {
      project.assignedStaff = [];
    }

    // Toggle staffId
    if (project.assignedStaff.includes(staffId)) {
      project.assignedStaff = project.assignedStaff.filter((id) => id !== staffId);
    } else {
      project.assignedStaff.push(staffId);
    }

    await project.save();
    // Re-populate for consistent response
    const updatedProject = await Project.findById(project._id)
      .populate("tasks")
      .populate("assignedStaff", "name email");

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
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