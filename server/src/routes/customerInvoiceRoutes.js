const express = require('express');
const router = express.Router();
const {
  createCustomerInvoice,
  getCustomerInvoices,
  getCustomerInvoiceById,
  updateCustomerInvoice,
  postCustomerInvoice,
  deleteCustomerInvoice
} = require('../controllers/customerInvoiceController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createCustomerInvoice)
  .get(getCustomerInvoices);

router.route('/:id')
  .get(getCustomerInvoiceById)
  .put(authorize('admin', 'accountant'), updateCustomerInvoice)
  .delete(authorize('admin', 'accountant'), deleteCustomerInvoice);

router.post('/:id/post', authorize('admin', 'accountant'), postCustomerInvoice);

module.exports = router;
