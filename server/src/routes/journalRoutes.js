const express = require('express');
const router = express.Router();
const {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal
} = require('../controllers/journalController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createJournal)
  .get(getJournals);

router.route('/:id')
  .get(getJournalById)
  .put(authorize('admin', 'accountant'), updateJournal)
  .delete(authorize('admin'), deleteJournal);

module.exports = router;
