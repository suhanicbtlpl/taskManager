const Document = require('../models/Document');
const DocumentPermission = require('../models/DocumentPermission');
const AccessRequest = require('../models/AccessRequest');
const asyncHandler = require('../middleware/asyncHandler');
const path = require('path');
const fs = require('fs');

// @desc    Get all documents with pagination and search
// @route   GET /api/documents
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = search ? {
        title: { $regex: search, $options: 'i' }
    } : {};

    const total = await Document.countDocuments(query);
    const documents = await Document.find(query)
        .populate('uploadedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // If user is Admin, they have full access
    const isAdmin = req.user.role?.roleName === 'Admin';

    // Get current user's permissions and pending requests
    const userPermissions = await DocumentPermission.find({ userId: req.user._id });
    const userRequests = await AccessRequest.find({ userId: req.user._id, status: 'pending' });

    // Augment documents with current user's access info
    const augmentedDocuments = documents.map(doc => {
        const docObj = doc.toObject();
        const isCreator = doc.uploadedBy._id.toString() === req.user._id.toString();
        
        if (isAdmin || isCreator) {
            docObj.access = 'both';
        } else {
            const perm = userPermissions.find(p => p.documentId.toString() === doc._id.toString());
            const hasRequested = userRequests.some(r => r.documentId.toString() === doc._id.toString());
            
            docObj.access = perm ? perm.accessType : null;
            docObj.hasRequested = hasRequested;
        }
        return docObj;
    });

    res.json({
        data: augmentedDocuments,
        total,
        page,
        pages: Math.ceil(total / limit)
    });
});

// @desc    Upload a document
// @route   POST /api/documents
// @access  Private
const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file');
    }

    const { title } = req.body;

    const document = await Document.create({
        title,
        fileName: req.file.filename,
        filePath: req.file.path,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        uploadedBy: req.user._id
    });

    res.status(201).json(document);
});

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }

    // Permission check
    const isAdmin = req.user.role?.roleName === 'Admin';
    const isCreator = document.uploadedBy.toString() === req.user._id.toString();
    const perm = await DocumentPermission.findOne({ userId: req.user._id, documentId: document._id });
    const hasEditAccess = perm && (perm.accessType === 'edit' || perm.accessType === 'both');

    if (!isAdmin && !isCreator && !hasEditAccess) {
        res.status(403);
        throw new Error('You do not have permission to delete this document');
    }

    // Remove file from filesystem
    if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
    }
    await document.deleteOne();
    res.json({ message: 'Document removed' });
});

// @desc    Download a document
// @route   GET /api/documents/:id/download
// @access  Private
const downloadDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }

    // Permission check
    const isAdmin = req.user.role?.roleName === 'Admin';
    const isCreator = document.uploadedBy.toString() === req.user._id.toString();
    const perm = await DocumentPermission.findOne({ userId: req.user._id, documentId: document._id });
    const hasViewAccess = perm && (perm.accessType === 'view' || perm.accessType === 'both');

    if (!isAdmin && !isCreator && !hasViewAccess) {
        res.status(403);
        throw new Error('You do not have permission to access this document');
    }

    const file = path.resolve(document.filePath);
    res.download(file, document.fileName);
});

module.exports = {
    getDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument
};
