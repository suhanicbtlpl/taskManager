const express = require('express');
const router = express.Router();
const { requestAccess, getAccessRequests, handleAccessRequest } = require('../controllers/accessController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, requestAccess);
router.get('/requests', protect, getAccessRequests);
router.put('/requests/:id', protect, handleAccessRequest);

module.exports = router;
