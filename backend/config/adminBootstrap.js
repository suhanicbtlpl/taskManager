const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const bootstrapAdmin = async () => {
    try {
        console.log("🚀 Running Admin Bootstrap...");

        // 1. Ensure core permissions exist
        const coreResources = ['Staff', 'Role', 'Permission', 'Project', 'Task', 'Document'];

        for (const name of coreResources) {
            const value = name.toUpperCase();

            const exists = await Permission.findOne({
                $or: [{ name }, { value }]
            });

            if (!exists) {
                await Permission.create({
                    name,
                    value
                });
                console.log(`✅ Permission created: ${name}`);
            }
        }

        // 2. Ensure Admin Role exists
        let adminRole = await Role.findOne({ roleName: 'Admin' });

        if (!adminRole) {
            adminRole = await Role.create({
                roleName: 'Admin',
                status: 'active',
                permissions: [] 
            });
            console.log('✅ Admin role created');
        }

        // 3. Ensure Admin User exists
        let adminUser = await User.findOne({ email: 'admin@example.com' });

        if (!adminUser) {
            adminUser = await User.create({
                name: 'System Admin',
                email: 'admin@example.com',
                password: 'admin123',
                mobileNumber: '0000000000',
                role: adminRole._id
            });
            console.log('✅ Admin user created');
        } else {
            if (!adminUser.role || adminUser.role.toString() !== adminRole._id.toString()) {
                adminUser.role = adminRole._id;
                await adminUser.save();
                console.log('🔄 Admin role assigned to existing user');
            }
        }

        console.log("✅ Bootstrap completed successfully");

    } catch (error) {
        console.error('❌ Admin Bootstrap Error:', error);
    }
};

module.exports = bootstrapAdmin;