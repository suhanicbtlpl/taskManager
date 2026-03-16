const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'No role assigned' });
        }

        // Admin Bypass: If roleName is 'Admin', allow all actions
        if (req.user.role.roleName === 'Admin') {
            return next();
        }

        const hasPermission = req.user.role.permissions.includes(permission);

        if (!hasPermission) {
            return res.status(403).json({ message: `Access denied: Required permission ${permission}` });
        }

        next();
    };
};

module.exports = { checkPermission };
