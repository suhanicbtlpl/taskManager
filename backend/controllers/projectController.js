const asyncHandler = require('../middleware/asyncHandler');
const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({}).populate('assignedStaff', 'name email').populate('createdBy', 'name');
    res.json(projects);
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    const { projectName, assignedStaff } = req.body;

    if (!projectName) {
        return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await Project.create({
        projectName,
        assignedStaff: assignedStaff || [],
        totalAssignedStaff: assignedStaff ? assignedStaff.length : 0,
        createdBy: req.user._id
    });

    res.status(201).json(project);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        project.projectName = req.body.projectName || project.projectName;
        project.assignedStaff = req.body.assignedStaff || project.assignedStaff;
        project.totalAssignedStaff = project.assignedStaff.length;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (project) {
        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

module.exports = { getProjects, createProject, updateProject, deleteProject };
