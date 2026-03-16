const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, checkPermission('VIEW_PROJECT'), getProjects)
    .post(protect, checkPermission('CREATE_PROJECT'), createProject);

router.route('/:id')
    .put(protect, checkPermission('UPDATE_PROJECT'), updateProject)
    .delete(protect, checkPermission('DELETE_PROJECT'), deleteProject);

module.exports = router;
