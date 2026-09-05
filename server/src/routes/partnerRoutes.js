const express = require('express');
const router = express.Router();
const { applyTradePartner, getTradePartners } = require('../controllers/tradePartnerController');

router.post('/apply', applyTradePartner);
router.get('/', getTradePartners);

module.exports = router;
