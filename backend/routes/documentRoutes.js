const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

// Multer config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.route('/')
    .get(protect, checkPermission('Document', 'read'), getDocuments)
    .post(protect, checkPermission('Document', 'create'), upload.single('file'), uploadDocument);

router.route('/:id')
    .delete(protect, checkPermission('Document', 'delete'), deleteDocument);

router.route('/:id/download')
    .get(protect, checkPermission('Document', 'read'), downloadDocument);

module.exports = router;
