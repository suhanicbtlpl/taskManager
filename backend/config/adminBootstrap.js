const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const bootstrapAdmin = async () => {
    try {
        // 1. Ensure core permissions exist
        const coreResources = ['Staff', 'Role', 'Permission', 'Project', 'Task', 'Document'];
        for (const name of coreResources) {
            const exists = await Permission.findOne({ name });
            if (!exists) {
                await Permission.create({ name });
                console.log(`✅ Base permission created: ${name}`);
            }
        }

        // 2. Ensure Admin Role exists
        let adminRole = await Role.findOne({ roleName: 'Admin' });
        
        if (!adminRole) {
            // Admin role doesn't strictly need the permissions array filled because 
            // the middleware/ProtectedRoute checks the roleName itself.
            // But we'll initialize it with the new structure for consistency.
            adminRole = await Role.create({
                roleName: 'Admin',
                status: 'active',
                permissions: [] 
            });
            console.log('✅ Admin role created');
        }

        // 3. Ensure Admin User exists
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
