const express = require('express');
const router = express.Router();
const { getStaff, createStaff, updateStaff, deleteStaff } = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, checkPermission('VIEW_STAFF'), getStaff)
    .post(protect, checkPermission('CREATE_STAFF'), createStaff);

router.route('/:id')
    .put(protect, checkPermission('UPDATE_STAFF'), updateStaff)
    .delete(protect, checkPermission('DELETE_STAFF'), deleteStaff);

module.exports = router;
