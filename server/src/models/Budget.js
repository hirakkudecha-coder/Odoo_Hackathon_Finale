const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    period: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    responsiblePerson: {
      type: String,
      default: 'Admin',
      trim: true
    },
    responsibleContact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      default: null
    },
    revisionOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
      default: null
    },
    revisedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
      default: null
    },
    analyticAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AnalyticAccount',
      required: true
    },
    plannedAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['draft', 'confirmed', 'revised', 'cancelled', 'closed'],
      default: 'draft'
    }
  },
  {
    timestamps: true
  }
);

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
