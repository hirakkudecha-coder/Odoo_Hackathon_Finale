const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateTicketStatus } = require('../controllers/helpdeskController');

router.post('/tickets', createTicket);
router.get('/tickets', getTickets);
router.patch('/tickets/:id/status', updateTicketStatus);

module.exports = router;
