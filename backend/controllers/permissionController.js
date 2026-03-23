const Role = require('../models/Role'); // ✅ IMPORT ROLE
const Permission = require('../models/Permission');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new permission
// @route   POST /api/permissions
// @access  Private/Admin
const createPermission = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const permissionExists = await Permission.findOne({ name });

    if (permissionExists) {
        return res.status(400).json({ message: 'Permission already exists' });
    }

    const permission = await Permission.create({ name });

    res.status(201).json(permission);
});

// @desc    Get all permissions
// @route   GET /api/permissions
// @access  Private
const getPermissions = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = search ? {
        name: { $regex: search, $options: 'i' }
    } : {};

    const total = await Permission.countDocuments(query);
    const permissions = await Permission.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);

    res.json({
        data: permissions,
        total,
        page,
        pages: Math.ceil(total / limit)
    });
});

// @desc    Update permission
// @route   PUT /api/permissions/:id
// @access  Private/Admin
const updatePermission = asyncHandler(async (req, res) => {
    const permission = await Permission.findById(req.params.id);

    if (permission) {
        permission.name = req.body.name || permission.name;
        const updatedPermission = await permission.save();
        res.json(updatedPermission);
    } else {
        res.status(404).json({ message: 'Permission not found' });
    }
});

// @desc    Delete permission
// @route   DELETE /api/permissions/:id
// @access  Private/Admin
// const deletePermission = asyncHandler(async (req, res) => {
//     const permission = await Permission.findById(req.params.id);
//     if (permission) {
//         await permission.deleteOne();
//         res.json({ message: 'Permission removed' });
//     } else {
//         res.status(404).json({ message: 'Permission not found' });
//     }
// });


const deletePermission = asyncHandler(async (req, res) => {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
    }

    // ✅ REMOVE permission from all roles
    await Role.updateMany(
        {},
        {
            $pull: {
                permissions: { name: permission.name }
            }
        }
    );

    // ✅ DELETE permission
    await permission.deleteOne();

    res.json({ message: 'Permission removed from system and roles' });
});
module.exports = { createPermission, getPermissions, updatePermission, deletePermission };
