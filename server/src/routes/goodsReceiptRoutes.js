const express = require('express');
const router = express.Router();
const {
  createGoodsReceipt,
  getGoodsReceipts,
  getGoodsReceiptById,
  updateGoodsReceipt,
  confirmGoodsReceipt,
  deleteGoodsReceipt
} = require('../controllers/goodsReceiptController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

// Admin can create; Admin + Accountant can view
router.route('/')
  .post(authorize('admin'), createGoodsReceipt)
  .get(authorize('admin', 'accountant'), getGoodsReceipts);

router.route('/:id')
  .get(authorize('admin', 'accountant'), getGoodsReceiptById)
  .put(authorize('admin'), updateGoodsReceipt)
  .delete(authorize('admin'), deleteGoodsReceipt);

// Both Admin and Accountant can process / confirm Goods Received
router.post('/:id/confirm', authorize('admin', 'accountant'), confirmGoodsReceipt);

module.exports = router;
