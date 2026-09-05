const express = require('express');
const router = express.Router();
const {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  postEntry,
  cancelEntry,
  deleteJournalEntry
} = require('../controllers/journalEntryController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createJournalEntry)
  .get(getJournalEntries);

router.route('/:id')
  .get(getJournalEntryById)
  .put(authorize('admin', 'accountant'), updateJournalEntry)
  .delete(authorize('admin', 'accountant'), deleteJournalEntry);

router.post('/:id/post', authorize('admin', 'accountant'), postEntry);
router.post('/:id/cancel', authorize('admin', 'accountant'), cancelEntry);

module.exports = router;
