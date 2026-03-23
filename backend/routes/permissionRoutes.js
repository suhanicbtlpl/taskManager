const express = require('express');
const router = express.Router();
const {
    getPermissions,
    createPermission,
    updatePermission,
    deletePermission
} = require('../controllers/permissionController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, checkPermission('Permission', 'read'), getPermissions)
    .post(protect, checkPermission('Permission', 'create'), createPermission);

router.route('/:id')
    .put(protect, checkPermission('Permission', 'update'), updatePermission)
    .delete(protect, checkPermission('Permission', 'delete'), deletePermission);

module.exports = router;
