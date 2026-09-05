const Account = require('../models/Account');
const escapeRegex = require('../utils/escapeRegex');

// Create account
const createAccount = async (req, res, next) => {
  try {
    const existing = await Account.findOne({ code: req.body.code });
    if (existing) {
      return res.status(400).json({ success: false, message: `Account code ${req.body.code} already exists.` });
    }

    const account = await Account.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      account
    });
  } catch (error) {
    next(error);
  }
};

// Get all accounts
const getAccounts = async (req, res, next) => {
  try {
    const { type, search, status } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    else filter.status = 'active';

    if (search) {
      const cleanSearch = escapeRegex(search);
      filter.$or = [
        { name: { $regex: cleanSearch, $options: 'i' } },
        { code: { $regex: cleanSearch, $options: 'i' } }
      ];
    }

    const accounts = await Account.find(filter).sort({ code: 1 });
    res.status(200).json({
      success: true,
      count: accounts.length,
      accounts
    });
  } catch (error) {
    next(error);
  }
};

// Get single account by ID
const getAccountById = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.status(200).json({ success: true, account });
  } catch (error) {
    next(error);
  }
};

// Update account
const updateAccount = async (req, res, next) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Account updated successfully',
      account
    });
  } catch (error) {
    next(error);
  }
};

// Delete account
const deleteAccount = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    if (account.isSystem) {
      return res.status(400).json({ success: false, message: 'System accounts cannot be deleted.' });
    }
    await Account.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount
};
