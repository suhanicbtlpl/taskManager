const express = require('express');
const router = express.Router();
const { getTasks, getTasksByProject, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, checkPermission('Task', 'read'), getTasks)
    .post(protect, checkPermission('Task', 'create'), createTask);

router.get('/project/:projectId', protect, checkPermission('Task', 'read'), getTasksByProject);

router.route('/:id')
    .put(protect, checkPermission('Task', 'update'), updateTask)
    .delete(protect, checkPermission('Task', 'delete'), deleteTask);

module.exports = router;
