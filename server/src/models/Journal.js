const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Sales', 'Purchase', 'Bank', 'Cash', 'General'],
      required: true
    },
    defaultDebitAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null
    },
    defaultCreditAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null
    },
    sequence: {
      type: Number,
      default: 1
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

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;
