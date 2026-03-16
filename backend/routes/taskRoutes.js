const express = require('express');
const router = express.Router();
const { getTasks, getTasksByProject, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, checkPermission('VIEW_TASK'), getTasks)
    .post(protect, checkPermission('CREATE_TASK'), createTask);

router.get('/project/:projectId', protect, getTasksByProject);

router.route('/:id')
    .put(protect, checkPermission('UPDATE_TASK'), updateTask)
    .delete(protect, checkPermission('DELETE_TASK'), deleteTask);

module.exports = router;
