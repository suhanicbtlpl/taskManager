const checkPermission = (resource, action) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'No role assigned' });
        }

        // Admin Bypass: If roleName is 'Admin', allow all actions
        if (req.user.role.roleName === 'Admin') {
            return next();
        }

        // Object-based permission check
        const permissions = req.user.role.permissions || [];
        const resourcePermission = permissions.find(p => p.name === resource);

        if (!resourcePermission || !resourcePermission.actions.includes(action)) {
            return res.status(403).json({ message: `Access denied: Required permission ${resource}.${action}` });
        }

        next();
    };
};

module.exports = { checkPermission };
