const express = require('express');
const router = express.Router();
const {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  reviseBudget,
  getBudgetDrilldown,
  deleteBudget
} = require('../controllers/budgetController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createBudget)
  .get(getBudgets);

router.post('/:id/revise', authorize('admin', 'accountant'), reviseBudget);
router.get('/:id/drilldown', getBudgetDrilldown);

router.route('/:id')
  .get(getBudgetById)
  .put(authorize('admin', 'accountant'), updateBudget)
  .delete(authorize('admin'), deleteBudget);

module.exports = router;
