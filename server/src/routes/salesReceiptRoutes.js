const express = require('express');
const router = express.Router();
const {
  createSalesReceipt,
  getSalesReceipts,
  getSalesReceiptById,
  updateSalesReceipt,
  confirmSalesReceipt,
  deleteSalesReceipt
} = require('../controllers/salesReceiptController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

// Admin can create; Admin + Accountant can view
router.route('/')
  .post(authorize('admin'), createSalesReceipt)
  .get(authorize('admin', 'accountant'), getSalesReceipts);

router.route('/:id')
  .get(authorize('admin', 'accountant'), getSalesReceiptById)
  .put(authorize('admin'), updateSalesReceipt)
  .delete(authorize('admin'), deleteSalesReceipt);

// Both Admin and Accountant can confirm/process Sales Receipts
router.post('/:id/confirm', authorize('admin', 'accountant'), confirmSalesReceipt);

module.exports = router;
