/**
 * Audit Log Routes
 * Urban Furniture ERP - Enterprise Security Suite
 */
const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditLogController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Protected: SuperAdmin & Admin only
router.get('/', authenticate, authorize('admin', 'superadmin'), getAuditLogs);

module.exports = router;
