const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Asset', 'Liability', 'Expense', 'Income', 'Capital'],
      required: true
    },
    balance: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ''
    },
    isSystem: {
      type: Boolean,
      default: false
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

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
