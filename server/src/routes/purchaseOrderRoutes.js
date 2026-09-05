const express = require('express');
const router = express.Router();
const {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  confirmPurchaseOrder,
  deletePurchaseOrder
} = require('../controllers/purchaseOrderController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createPurchaseOrder)
  .get(getPurchaseOrders);

router.route('/:id')
  .get(getPurchaseOrderById)
  .put(authorize('admin', 'accountant'), updatePurchaseOrder)
  .delete(authorize('admin', 'accountant'), deletePurchaseOrder);

router.post('/:id/confirm', authorize('admin', 'accountant'), confirmPurchaseOrder);

module.exports = router;
