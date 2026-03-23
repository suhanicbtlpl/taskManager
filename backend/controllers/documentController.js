const Document = require('../models/Document');
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

    res.json({
        data: documents,
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

    if (document) {
        // Remove file from filesystem
        if (fs.existsSync(document.filePath)) {
            fs.unlinkSync(document.filePath);
        }
        await document.deleteOne();
        res.json({ message: 'Document removed' });
    } else {
        res.status(404);
        throw new Error('Document not found');
    }
});

// @desc    Download a document
// @route   GET /api/documents/:id/download
// @access  Private
const downloadDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (document) {
        const file = path.resolve(document.filePath);
        res.download(file, document.fileName);
    } else {
        res.status(404);
        throw new Error('Document not found');
    }
});

module.exports = {
    getDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument
};
