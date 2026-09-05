const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
} = require('../controllers/contactController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createContact)
  .get(getContacts);

router.route('/:id')
  .get(getContactById)
  .put(authorize('admin', 'accountant'), updateContact)
  .delete(authorize('admin'), deleteContact);

module.exports = router;
