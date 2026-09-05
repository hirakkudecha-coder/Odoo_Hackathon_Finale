const JournalEntry = require('../models/JournalEntry');
const { postJournalEntry, cancelJournalEntry } = require('../services/accountingEngine');
const escapeRegex = require('../utils/escapeRegex');

// Create Draft Journal Entry
const createJournalEntry = async (req, res, next) => {
  try {
    const { journal, date, reference, partner, items } = req.body;

    const entry = await JournalEntry.create({
      journal,
      date: date || new Date(),
      reference,
      partner,
      items,
      status: 'draft'
    });

    await entry.populate([
      { path: 'journal', select: 'name code type' },
      { path: 'partner', select: 'name type email' },
      { path: 'items.account', select: 'name code type' },
      { path: 'items.analyticAccount', select: 'name code type' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Draft journal entry created successfully',
      journalEntry: entry
    });
  } catch (error) {
    next(error);
  }
};

// Get all Journal Entries
const getJournalEntries = async (req, res, next) => {
  try {
    const { journal, status, partner, startDate, endDate, search } = req.query;
    const filter = {};

    if (journal) filter.journal = journal;
    if (status) filter.status = status;
    if (partner) filter.partner = partner;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (search) {
      const cleanSearch = escapeRegex(search);
      filter.$or = [
        { entryNumber: { $regex: cleanSearch, $options: 'i' } },
        { reference: { $regex: cleanSearch, $options: 'i' } }
      ];
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
    const skip = (page - 1) * limit;

    const totalCount = await JournalEntry.countDocuments(filter);
    const journalEntries = await JournalEntry.find(filter)
      .populate('journal', 'name code type')
      .populate('partner', 'name type email')
      .populate('items.account', 'name code type')
      .populate('items.analyticAccount', 'name code type')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: journalEntries.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      journalEntries
    });
  } catch (error) {
    next(error);
  }
};

// Get single Journal Entry by ID
const getJournalEntryById = async (req, res, next) => {
  try {
    const entry = await JournalEntry.findById(req.params.id)
      .populate('journal', 'name code type')
      .populate('partner', 'name type email')
      .populate('items.account', 'name code type')
      .populate('items.analyticAccount', 'name code type')
      .populate('postedBy', 'name email');

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    res.status(200).json({ success: true, journalEntry: entry });
  } catch (error) {
    next(error);
  }
};

// Update Draft Journal Entry
const updateJournalEntry = async (req, res, next) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    if (entry.status === 'posted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a posted journal entry. Cancel or reverse it instead.'
      });
    }

    if (req.body.journal) entry.journal = req.body.journal;
    if (req.body.date) entry.date = req.body.date;
    if (req.body.reference !== undefined) entry.reference = req.body.reference;
    if (req.body.partner !== undefined) entry.partner = req.body.partner;
    if (req.body.items) entry.items = req.body.items;

    await entry.save();

    const populated = await JournalEntry.findById(entry._id)
      .populate('journal', 'name code type')
      .populate('partner', 'name type email')
      .populate('items.account', 'name code type');

    res.status(200).json({
      success: true,
      message: 'Journal entry updated successfully',
      journalEntry: populated
    });
  } catch (error) {
    next(error);
  }
};

// Post Journal Entry (Enforces Debit = Credit and updates ledger)
const postEntry = async (req, res, next) => {
  try {
    const postedEntry = await postJournalEntry(req.params.id, req.user?._id);
    await postedEntry.populate([
      { path: 'journal', select: 'name code type' },
      { path: 'partner', select: 'name type email' },
      { path: 'items.account', select: 'name code type' },
      { path: 'postedBy', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Journal entry posted successfully. Ledger updated.',
      journalEntry: postedEntry
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Journal Entry (Reverses ledger impact)
const cancelEntry = async (req, res, next) => {
  try {
    const cancelledEntry = await cancelJournalEntry(req.params.id, req.user?._id);
    res.status(200).json({
      success: true,
      message: 'Journal entry cancelled successfully. Ledger impact reversed.',
      journalEntry: cancelledEntry
    });
  } catch (error) {
    next(error);
  }
};

// Delete Draft Entry
const deleteJournalEntry = async (req, res, next) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    if (entry.status === 'posted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a posted journal entry. Cancel it first.'
      });
    }

    await JournalEntry.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  postEntry,
  cancelEntry,
  deleteJournalEntry
};
