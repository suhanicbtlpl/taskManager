const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    permissions: [{
        name: {
            type: String,
            required: true
        },
        actions: [{
            type: String,
            enum: ['create', 'read', 'update', 'delete']
        }]
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);
