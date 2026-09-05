const HelpdeskTicket = require('../models/HelpdeskTicket');

const INITIAL_TICKETS = [
  {
    ticketNumber: 'TKT-9204',
    name: 'Vikramaditya Oberoi',
    email: 'oberoi@luxuryinteriors.com',
    referenceNo: 'JE-2026-0041',
    category: 'Double-Entry Ledger Balancing',
    priority: 'High',
    subject: 'Double-entry journal auto-reconciliation discrepancy',
    message: 'Investigating unbalanced suspense line on raw timber debit allocation.',
    status: 'Resolved',
    assignedAgent: 'Aarav Mehta (Lead Concierge)'
  },
  {
    ticketNumber: 'TKT-8841',
    name: 'Ananya Deshmukh',
    email: 'ananya@studiovista.in',
    referenceNo: 'PO-2026-0089',
    category: 'Order Customization & Shop Drawings',
    priority: 'Medium',
    subject: 'Custom Teak Credenza dimension sign-off & shop drawings',
    message: 'Need updated CAD elevation with custom wire-chase holes for AV equipment.',
    status: 'In Progress',
    assignedAgent: 'Dia Sen (Bespoke Liaison)'
  },
  {
    ticketNumber: 'TKT-7619',
    name: 'Kabir Singhal',
    email: 'singhal@heritagefoundry.com',
    referenceNo: 'INV-2026-0056',
    category: 'Trade Partner Commission & Invoicing',
    priority: 'Standard',
    subject: 'Annual Trade Rebate credit note issuance',
    message: 'Q3 procurement milestone reached (28% Gold Studio Guild margin).',
    status: 'Submitted',
    assignedAgent: 'Rohan Nair (Trade Relations)'
  }
];

// Create new helpdesk ticket
const createTicket = async (req, res, next) => {
  try {
    const { name, email, referenceNo, category, priority, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required.'
      });
    }

    const ticket = await HelpdeskTicket.create({
      name,
      email,
      referenceNo: referenceNo || '',
      category: category || 'Double-Entry Ledger Balancing',
      priority: priority || 'Medium',
      subject,
      message,
      status: 'Submitted',
      assignedAgent: 'Aarav Mehta (Lead Concierge)'
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully.',
      ticket
    });
  } catch (error) {
    next(error);
  }
};

// Get all helpdesk tickets (auto-seed default tickets if empty)
const getTickets = async (req, res, next) => {
  try {
    let tickets = await HelpdeskTicket.find().sort({ createdAt: -1 });

    if (tickets.length === 0) {
      await HelpdeskTicket.insertMany(INITIAL_TICKETS);
      tickets = await HelpdeskTicket.find().sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    next(error);
  }
};

// Update ticket status
const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ticket = await HelpdeskTicket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket status updated.',
      ticket
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTickets,
  updateTicketStatus
};
