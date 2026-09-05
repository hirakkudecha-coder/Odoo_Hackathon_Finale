const mongoose = require('mongoose');

const analyticAccountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      default: ''
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Income', 'Expenses'],
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

const AnalyticAccount = mongoose.model('AnalyticAccount', analyticAccountSchema);

module.exports = AnalyticAccount;
