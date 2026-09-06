const express = require('express');
const router = express.Router();
const { applyTradePartner, getTradePartners, updatePartnerStatus } = require('../controllers/tradePartnerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { publicFormLimiter } = require('../middleware/rateLimitMiddleware');

// Public application endpoint
router.post('/apply', publicFormLimiter, applyTradePartner);

// Protected staff management endpoints
router.get('/', authenticate, authorize('admin', 'accountant'), getTradePartners);
router.patch('/:id/status', authenticate, authorize('admin', 'accountant'), updatePartnerStatus);

module.exports = router;

