// checkRole.js

module.exports = function checkRole(...allowedRoles) {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next(); // proceed to the next middleware/route
    };
};
