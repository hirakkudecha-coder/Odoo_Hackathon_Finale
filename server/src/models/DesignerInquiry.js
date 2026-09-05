const mongoose = require('mongoose');

const designerInquirySchema = new mongoose.Schema(
  {
    inquiryNumber: {
      type: String,
      unique: true,
      required: true,
      default: () => `INQ-${Math.floor(100000 + Math.random() * 900000)}`
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
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    projectType: {
      type: String,
      enum: [
        'Residential Interior',
        'Commercial Office',
        'Hospitality',
        'Architectural Contract',
        'Bespoke Private Commission'
      ],
      default: 'Residential Interior'
    },
    estimatedBudget: {
      type: String,
      default: '$25,000 - $50,000'
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'contacted', 'scheduled', 'archived'],
      default: 'new'
    },
    assignedLead: {
      type: String,
      default: 'Elena Rossi & Vikram Singhania (Principal Architects)'
    }
  },
  {
    timestamps: true
  }
);

const DesignerInquiry = mongoose.model('DesignerInquiry', designerInquirySchema);

module.exports = DesignerInquiry;
