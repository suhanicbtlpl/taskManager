const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, checkPermission('Project', 'read'), getProjects)
    .post(protect, checkPermission('Project', 'create'), createProject);

router.route('/:id')
    .put(protect, checkPermission('Project', 'update'), updateProject)
    .delete(protect, checkPermission('Project', 'delete'), deleteProject);

module.exports = router;
