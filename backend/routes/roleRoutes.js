const express = require('express');
const router = express.Router();
const { createRole, getRoles, updateRole, deleteRole } = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getRoles)
    .post(protect, checkPermission('CREATE_ROLE'), createRole);

router.route('/:id')
    .put(protect, checkPermission('UPDATE_ROLE'), updateRole)
    .delete(protect, checkPermission('DELETE_ROLE'), deleteRole);

module.exports = router;
