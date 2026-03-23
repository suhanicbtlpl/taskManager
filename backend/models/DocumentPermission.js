const mongoose = require('mongoose');

const documentPermissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    accessType: {
        type: String,
        enum: ['view', 'edit', 'both'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DocumentPermission', documentPermissionSchema);
