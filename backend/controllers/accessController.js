const AccessRequest = require('../models/AccessRequest');
const DocumentPermission = require('../models/DocumentPermission');
const Document = require('../models/Document');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Request access to a document
// @route   POST /api/access/request
// @access  Private
const requestAccess = asyncHandler(async (req, res) => {
    const { documentId } = req.body;

    const existingRequest = await AccessRequest.findOne({
        userId: req.user._id,
        documentId,
        status: 'pending'
    });

    if (existingRequest) {
        return res.status(400).json({ message: 'Access request already pending' });
    }

    const accessRequest = await AccessRequest.create({
        userId: req.user._id,
        documentId
    });

    res.status(201).json(accessRequest);
});

// @desc    Get all access requests
const getAccessRequests = asyncHandler(async (req, res) => {
    const requests = await AccessRequest.find()
        .populate('userId', 'name email')
        .populate('documentId', 'title')
        .sort({ createdAt: -1 });
    res.json(requests);
});

// @desc    Handle request
const handleAccessRequest = asyncHandler(async (req, res) => {
    const { status, accessType } = req.body;
    const request = await AccessRequest.findById(req.params.id);

    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    await request.save();

    if (status === 'approved') {
        await DocumentPermission.findOneAndUpdate(
            { userId: request.userId, documentId: request.documentId },
            { accessType },
            { upsert: true, new: true }
        );
    }
    res.json({ message: `Request ${status}`, request });
});

module.exports = { requestAccess, getAccessRequests, handleAccessRequest };
