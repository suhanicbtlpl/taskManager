const Role = require('../models/Role');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private/Admin (requires CREATE_ROLE)
const createRole = asyncHandler(async (req, res) => {
    const { roleName, permissions, status } = req.body;

    const roleExists = await Role.findOne({ roleName });

    if (roleExists) {
        return res.status(400).json({ message: 'Role already exists' });
    }

    const role = await Role.create({
        roleName,
        permissions,
        status
    });

    res.status(201).json(role);
});

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private
const getRoles = asyncHandler(async (req, res) => {
    const roles = await Role.find({});
    res.json(roles);
});

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private/Admin
const updateRole = asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);

    if (role) {
        role.roleName = req.body.roleName || role.roleName;
        role.permissions = req.body.permissions || role.permissions;
        role.status = req.body.status || role.status;

        const updatedRole = await role.save();
        res.json(updatedRole);
    } else {
        res.status(404).json({ message: 'Role not found' });
    }
});

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
const deleteRole = asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (role) {
        await role.deleteOne();
        res.json({ message: 'Role removed' });
    } else {
        res.status(404).json({ message: 'Role not found' });
    }
});

module.exports = { createRole, getRoles, updateRole, deleteRole };
