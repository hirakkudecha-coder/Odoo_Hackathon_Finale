const express = require('express');
const router = express.Router();
const {
  getProfitAndLoss,
  getBalanceSheet,
  getBudgetSummary
} = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/profit-loss', authorize('admin', 'accountant'), getProfitAndLoss);
router.get('/balance-sheet', authorize('admin', 'accountant'), getBalanceSheet);
router.get('/budget', authorize('admin', 'accountant'), getBudgetSummary);

module.exports = router;
