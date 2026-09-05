const express = require('express');
const router = express.Router();
const { register, createUserByAdmin, login, getMe, getUsers } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, authorize('admin', 'superadmin'), getUsers);
router.post('/users', authenticate, authorize('admin', 'superadmin'), createUserByAdmin);

module.exports = router;
