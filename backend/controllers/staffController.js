const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all staff with pagination and search
// @route   GET /api/staff
// @access  Private
const getStaff = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = search ? {
        $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ]
    } : {};

    const total = await User.countDocuments(query);
    const staff = await User.find(query)
        .populate('role', 'roleName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.json({
        data: staff,
        total,
        page,
        pages: Math.ceil(total / limit)
    });
});

// @desc    Create new staff member
// @route   POST /api/staff
// @access  Private/Admin
const createStaff = asyncHandler(async (req, res) => {
    const { name, email, password, mobileNumber, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        mobileNumber,
        role
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role
    });
});

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.mobileNumber = req.body.mobileNumber || user.mobileNumber;
        user.role = req.body.role || user.role;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getStaff, createStaff, updateStaff, deleteStaff };
