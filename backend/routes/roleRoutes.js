const express = require('express');
const router = express.Router();
const { createRole, getRoles, updateRole, deleteRole } = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, checkPermission('Role', 'read'), getRoles)
    .post(protect, checkPermission('Role', 'create'), createRole);

router.route('/:id')
    .put(protect, checkPermission('Role', 'update'), updateRole)
    .delete(protect, checkPermission('Role', 'delete'), deleteRole);

module.exports = router;
