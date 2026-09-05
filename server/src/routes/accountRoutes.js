const express = require('express');
const router = express.Router();
const {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount
} = require('../controllers/accountController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createAccount)
  .get(getAccounts);

router.route('/:id')
  .get(getAccountById)
  .put(authorize('admin', 'accountant'), updateAccount)
  .delete(authorize('admin'), deleteAccount);

module.exports = router;
