const AnalyticAccount = require('../models/AnalyticAccount');

// Create analytic account
const createAnalyticAccount = async (req, res, next) => {
  try {
    const analyticAccount = await AnalyticAccount.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Analytic account created successfully',
      analyticAccount
    });
  } catch (error) {
    next(error);
  }
};

// Get all analytic accounts
const getAnalyticAccounts = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    else filter.status = 'active';

    const page = req.query.page ? parseInt(req.query.page, 10) : null;
    const limit = req.query.limit ? Math.min(parseInt(req.query.limit, 10), 100) : null;

    const totalCount = await AnalyticAccount.countDocuments(filter);
    let query = AnalyticAccount.find(filter).sort({ name: 1 });

    if (page && limit) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const analyticAccounts = await query;
    res.status(200).json({
      success: true,
      count: analyticAccounts.length,
      totalCount,
      page: page || 1,
      totalPages: limit ? Math.ceil(totalCount / limit) : 1,
      analyticAccounts
    });
  } catch (error) {
    next(error);
  }
};

// Get single analytic account by ID
const getAnalyticAccountById = async (req, res, next) => {
  try {
    const analyticAccount = await AnalyticAccount.findById(req.params.id);
    if (!analyticAccount) {
      return res.status(404).json({ success: false, message: 'Analytic account not found' });
    }
    res.status(200).json({ success: true, analyticAccount });
  } catch (error) {
    next(error);
  }
};

// Update analytic account
const updateAnalyticAccount = async (req, res, next) => {
  try {
    const analyticAccount = await AnalyticAccount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!analyticAccount) {
      return res.status(404).json({ success: false, message: 'Analytic account not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Analytic account updated successfully',
      analyticAccount
    });
  } catch (error) {
    next(error);
  }
};

// Delete analytic account
const deleteAnalyticAccount = async (req, res, next) => {
  try {
    const analyticAccount = await AnalyticAccount.findByIdAndDelete(req.params.id);
    if (!analyticAccount) {
      return res.status(404).json({ success: false, message: 'Analytic account not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Analytic account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnalyticAccount,
  getAnalyticAccounts,
  getAnalyticAccountById,
  updateAnalyticAccount,
  deleteAnalyticAccount
};
