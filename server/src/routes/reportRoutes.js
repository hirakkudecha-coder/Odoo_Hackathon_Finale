const express = require('express');
const router = express.Router();
const {
  getProfitAndLoss,
  getBalanceSheet,
  getBudgetSummary,
  getStockValuation
} = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get(['/profit-loss', '/profit-and-loss'], authorize('admin', 'accountant'), getProfitAndLoss);
router.get('/balance-sheet', authorize('admin', 'accountant'), getBalanceSheet);
router.get(['/budget', '/budgets'], authorize('admin', 'accountant'), getBudgetSummary);
router.get(['/stock', '/stock-valuation'], authorize('admin', 'accountant'), getStockValuation);

module.exports = router;
