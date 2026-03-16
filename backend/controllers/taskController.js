const Task = require('../models/Task');
const Project = require('../models/Project');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({}).populate('projectId', 'projectName').populate('assignedTo', 'name email').populate('createdBy', 'name');
    res.json(tasks);
});

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
    const tasks = await Task.find({ projectId: req.params.projectId }).populate('assignedTo', 'name email');
    res.json(tasks);
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    const { taskName, projectId, assignedTo, status } = req.body;

    const task = await Task.create({
        taskName,
        projectId,
        assignedTo,
        status,
        createdBy: req.user._id
    });

    // Add task to project
    await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });
    res.status(201).json(task);
});

// @desc    Update task status or details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        task.taskName = req.body.taskName || task.taskName;
        task.assignedTo = req.body.assignedTo || task.assignedTo;
        task.status = req.body.status || task.status;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
        await Project.findByIdAndUpdate(task.projectId, { $pull: { tasks: task._id } });
        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

module.exports = { getTasks, getTasksByProject, createTask, updateTask, deleteTask };
