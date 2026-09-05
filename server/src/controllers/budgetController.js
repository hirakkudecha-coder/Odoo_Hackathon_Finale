const Budget = require('../models/Budget');
const AnalyticAccount = require('../models/AnalyticAccount');

// Create budget
const createBudget = async (req, res, next) => {
  try {
    if (!req.body.analyticAccount) {
      return res.status(400).json({ success: false, message: 'analyticAccount reference is required.' });
    }
    const analytic = await AnalyticAccount.findById(req.body.analyticAccount);
    if (!analytic) {
      return res.status(404).json({ success: false, message: 'Invalid analyticAccount reference: Analytic account not found.' });
    }

    const budget = await Budget.create(req.body);
    await budget.populate('analyticAccount', 'name code type');
    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      budget
    });
  } catch (error) {
    next(error);
  }
};

// Get all budgets
const getBudgets = async (req, res, next) => {
  try {
    const { period, status } = req.query;
    const filter = {};

    if (period) filter.period = period;
    if (status) filter.status = status;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
    const skip = (page - 1) * limit;

    const totalCount = await Budget.countDocuments(filter);
    const budgets = await Budget.find(filter)
      .populate('analyticAccount', 'name code type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: budgets.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      budgets
    });
  } catch (error) {
    next(error);
  }
};

// Get single budget by ID
const getBudgetById = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id)
      .populate('analyticAccount', 'name code type');

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.status(200).json({ success: true, budget });
  } catch (error) {
    next(error);
  }
};

// Update budget
const updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('analyticAccount', 'name code type');

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      budget
    });
  } catch (error) {
    next(error);
  }
};

// Delete budget
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget
};
