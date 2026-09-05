const express = require('express');
const router = express.Router();
const { applyTradePartner, getTradePartners, updatePartnerStatus } = require('../controllers/tradePartnerController');

router.post('/apply', applyTradePartner);
router.get('/', getTradePartners);
router.patch('/:id/status', updatePartnerStatus);

module.exports = router;

