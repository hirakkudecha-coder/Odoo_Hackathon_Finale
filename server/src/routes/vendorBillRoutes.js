const express = require('express');
const router = express.Router();
const {
  createVendorBill,
  getVendorBills,
  getVendorBillById,
  updateVendorBill,
  postVendorBill,
  deleteVendorBill
} = require('../controllers/vendorBillController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createVendorBill)
  .get(getVendorBills);

router.route('/:id')
  .get(getVendorBillById)
  .put(authorize('admin', 'accountant'), updateVendorBill)
  .delete(authorize('admin'), deleteVendorBill);

router.post('/:id/post', authorize('admin', 'accountant'), postVendorBill);

module.exports = router;
