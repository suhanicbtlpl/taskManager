const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data (optional, but good for a fresh start)
        // await User.deleteMany();
        // await Role.deleteMany();

        // 1. Create Admin Role
        let adminRole = await Role.findOne({ roleName: 'Admin' });
        if (!adminRole) {
            adminRole = await Role.create({
                roleName: 'Admin',
                status: 'active',
                permissions: [
                    'CREATE_STAFF', 'VIEW_STAFF', 'UPDATE_STAFF', 'DELETE_STAFF',
                    'CREATE_PROJECT', 'VIEW_PROJECT', 'UPDATE_PROJECT', 'DELETE_PROJECT',
                    'CREATE_TASK', 'VIEW_TASK', 'UPDATE_TASK', 'DELETE_TASK',
                    'CREATE_ROLE', 'VIEW_ROLE', 'UPDATE_ROLE', 'DELETE_ROLE'
                ]
            });
            console.log('Admin Role Created');
        }

        // 2. Create Admin User
        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin123';

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword, // Will be hashed by User model pre-save hook
                mobileNumber: '1234567890',
                role: adminRole._id
            });
            console.log('Admin User Created');
            console.log('Email: admin@example.com');
            console.log('Password: admin123');
        } else {
            console.log('Admin user already exists');
        }

        console.log('Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
