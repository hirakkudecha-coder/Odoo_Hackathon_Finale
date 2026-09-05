const Journal = require('../models/Journal');

// Create journal
const createJournal = async (req, res, next) => {
  try {
    const existing = await Journal.findOne({ code: req.body.code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Journal code ${req.body.code} already exists.` });
    }

    const journal = await Journal.create({
      ...req.body,
      code: req.body.code.toUpperCase()
    });
    res.status(201).json({
      success: true,
      message: 'Journal created successfully',
      journal
    });
  } catch (error) {
    next(error);
  }
};

// Get all journals
const getJournals = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    else filter.status = 'active';

    const journals = await Journal.find(filter)
      .populate('defaultDebitAccount', 'name code type')
      .populate('defaultCreditAccount', 'name code type')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: journals.length,
      journals
    });
  } catch (error) {
    next(error);
  }
};

// Get single journal by ID
const getJournalById = async (req, res, next) => {
  try {
    const journal = await Journal.findById(req.params.id)
      .populate('defaultDebitAccount', 'name code type')
      .populate('defaultCreditAccount', 'name code type');

    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal not found' });
    }
    res.status(200).json({ success: true, journal });
  } catch (error) {
    next(error);
  }
};

// Update journal
const updateJournal = async (req, res, next) => {
  try {
    if (req.body.code) req.body.code = req.body.code.toUpperCase();
    const journal = await Journal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Journal updated successfully',
      journal
    });
  } catch (error) {
    next(error);
  }
};

// Delete journal
const deleteJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findByIdAndDelete(req.params.id);
    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Journal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal
};
