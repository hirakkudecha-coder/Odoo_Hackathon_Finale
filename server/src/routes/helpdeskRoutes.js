const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateTicketStatus } = require('../controllers/helpdeskController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public ticket submission
router.post('/tickets', createTicket);

// Protected staff ticket management
router.get('/tickets', authenticate, authorize('admin', 'accountant'), getTickets);
router.patch('/tickets/:id/status', authenticate, authorize('admin', 'accountant'), updateTicketStatus);

module.exports = router;
