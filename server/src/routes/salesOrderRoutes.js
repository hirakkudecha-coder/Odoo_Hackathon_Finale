const express = require('express');
const router = express.Router();
const {
  createSalesOrder,
  getSalesOrders,
  getSalesOrderById,
  updateSalesOrder,
  confirmSalesOrder,
  deleteSalesOrder
} = require('../controllers/salesOrderController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createSalesOrder)
  .get(getSalesOrders);

router.route('/:id')
  .get(getSalesOrderById)
  .put(authorize('admin', 'accountant'), updateSalesOrder)
  .delete(authorize('admin', 'accountant'), deleteSalesOrder);

router.post('/:id/confirm', authorize('admin', 'accountant'), confirmSalesOrder);

module.exports = router;
