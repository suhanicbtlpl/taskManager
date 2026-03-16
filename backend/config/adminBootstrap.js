const User = require('../models/User');
const Role = require('../models/Role');

const bootstrapAdmin = async () => {
    try {
        // 1. Ensure Admin Role exists
        let adminRole = await Role.findOne({ roleName: 'Admin' });
        
        if (!adminRole) {
            adminRole = await Role.create({
                roleName: 'Admin',
                status: 'active',
                permissions: ['ALL'] // Placeholder, but roleMiddleware will bypass for 'Admin'
            });
            console.log('✅ Admin role created');
        }

        // 2. Ensure Admin User exists
        const adminUser = await User.findOne({ email: 'admin@example.com' });
        
        if (!adminUser) {
            await User.create({
                name: 'System Admin',
                email: 'admin@example.com',
                password: 'admin123', // Will be hashed by User model pre-save hook
                mobileNumber: '0000000000',
                role: adminRole._id
            });
            console.log('✅ Default Admin user created: admin@example.com / admin123');
        } else {
            // Ensure the existing user has the Admin role
            if (!adminUser.role || adminUser.role.toString() !== adminRole._id.toString()) {
                adminUser.role = adminRole._id;
                await adminUser.save();
                console.log('🔄 Updated existing user to Admin role');
            }
        }
    } catch (error) {
        console.error('❌ Admin Bootstrap Error:', error.message);
    }
};

module.exports = bootstrapAdmin;
