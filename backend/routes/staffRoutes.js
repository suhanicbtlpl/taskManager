const express = require('express');
const router = express.Router();
const { getStaff, createStaff, updateStaff, deleteStaff } = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, checkPermission('Staff', 'read'), getStaff)
    .post(protect, checkPermission('Staff', 'create'), createStaff);

router.route('/:id')
    .put(protect, checkPermission('Staff', 'update'), updateStaff)
    .delete(protect, checkPermission('Staff', 'delete'), deleteStaff);

module.exports = router;
