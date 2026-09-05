const mongoose = require('mongoose');

const helpdeskTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
      default: () => `TKT-${Math.floor(1000 + Math.random() * 9000)}`
    },
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true
    },
    referenceNo: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: true,
      default: 'Double-Entry Ledger Balancing'
    },
    priority: {
      type: String,
      enum: ['Standard', 'Medium', 'Urgent', 'Urgent Ledger Halt', 'Urgent (Ledger Halt)', 'High'],
      default: 'Medium'
    },
    subject: {
      type: String,
      required: [true, 'Ticket subject is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Ticket description is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Submitted', 'In Progress', 'Resolved', 'Closed'],
      default: 'Submitted'
    },
    assignedAgent: {
      type: String,
      default: 'Aarav Mehta (Lead Concierge)'
    }
  },
  {
    timestamps: true
  }
);

const HelpdeskTicket = mongoose.model('HelpdeskTicket', helpdeskTicketSchema);

module.exports = HelpdeskTicket;
