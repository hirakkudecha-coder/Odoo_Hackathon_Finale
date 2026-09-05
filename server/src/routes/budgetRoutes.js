const express = require('express');
const router = express.Router();
const {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget
} = require('../controllers/budgetController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createBudget)
  .get(getBudgets);

router.route('/:id')
  .get(getBudgetById)
  .put(authorize('admin', 'accountant'), updateBudget)
  .delete(authorize('admin'), deleteBudget);

module.exports = router;
