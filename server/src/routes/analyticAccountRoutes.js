const express = require('express');
const router = express.Router();
const {
  createAnalyticAccount,
  getAnalyticAccounts,
  getAnalyticAccountById,
  updateAnalyticAccount,
  deleteAnalyticAccount
} = require('../controllers/analyticAccountController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createAnalyticAccount)
  .get(getAnalyticAccounts);

router.route('/:id')
  .get(getAnalyticAccountById)
  .put(authorize('admin', 'accountant'), updateAnalyticAccount)
  .delete(authorize('admin'), deleteAnalyticAccount);

module.exports = router;
