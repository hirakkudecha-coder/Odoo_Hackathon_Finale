const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentById
} = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createPayment)
  .get(getPayments);

router.route('/:id')
  .get(getPaymentById);

module.exports = router;
