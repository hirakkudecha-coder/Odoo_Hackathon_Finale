const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries, updateInquiryStatus } = require('../controllers/designerInquiryController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public inquiry submission
router.post('/designer', createInquiry);

// Protected staff inquiry management
router.get('/designer', authenticate, authorize('admin', 'accountant'), getInquiries);
router.patch('/designer/:id/status', authenticate, authorize('admin', 'accountant'), updateInquiryStatus);

module.exports = router;

