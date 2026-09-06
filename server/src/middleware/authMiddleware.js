const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'urban_furniture_super_secret_jwt_key_2026';

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or inactive user account.'
      });
    }

    // Immediate token invalidation if password was changed after token issuance
    if (user.passwordChangedAt && decoded.iat) {
      const changedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (changedTimestamp > decoded.iat) {
        return res.status(401).json({
          success: false,
          message: 'Your password was recently changed. Please log in again with your new credentials.'
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      error: error.message
    });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before authorization.'
      });
    }

    // superadmin automatically satisfies any admin role or authorized role check
    if (req.user.role === 'superadmin' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource. Allowed roles: ${allowedRoles.join(', ')}`
    });
  };
};

module.exports = {
  authenticate,
  authorize
};

