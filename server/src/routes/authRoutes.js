const express = require('express');
const router = express.Router();
const { 
  register, 
  createUserByAdmin, 
  login, 
  forgotPassword,
  resetPassword,
  changePassword, 
  resetUserPasswordByAdmin, 
  setup2FA,
  verifyAndEnable2FA,
  disable2FA,
  getMe, 
  getUsers 
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Protected routes
router.get('/me', authenticate, getMe);
router.put('/change-password', authenticate, changePassword);
router.get('/users', authenticate, authorize('admin', 'superadmin'), getUsers);
router.post('/users', authenticate, authorize('admin', 'superadmin'), createUserByAdmin);
router.put('/users/:id/password', authenticate, authorize('admin', 'superadmin'), resetUserPasswordByAdmin);

// Two-Factor Authentication (2FA) routes
router.post('/2fa/setup', authenticate, setup2FA);
router.post('/2fa/verify-and-enable', authenticate, verifyAndEnable2FA);
router.post('/2fa/disable', authenticate, disable2FA);

module.exports = router;
