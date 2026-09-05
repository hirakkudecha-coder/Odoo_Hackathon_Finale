const mongoose = require('mongoose');

const journalItemSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Account is required for journal item']
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    default: null
  },
  label: {
    type: String,
    default: '',
    trim: true
  },
  debit: {
    type: Number,
    default: 0,
    min: 0
  },
  credit: {
    type: Number,
    default: 0,
    min: 0
  },
  analyticAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalyticAccount',
    default: null
  }
});

const journalEntrySchema = new mongoose.Schema(
  {
    entryNumber: {
      type: String,
      trim: true
    },
    journal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journal',
      required: [true, 'Journal is required']
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    reference: {
      type: String,
      default: '',
      trim: true
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      default: null
    },
    items: {
      type: [journalItemSchema],
      required: true,
      validate: [items => items.length >= 2, 'A journal entry must have at least 2 items (debit and credit).']
    },
    totalDebit: {
      type: Number,
      default: 0
    },
    totalCredit: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'posted', 'cancelled'],
      default: 'draft'
    },
    postedAt: {
      type: Date,
      default: null
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook: compute totalDebit and totalCredit & generate sequence if needed
journalEntrySchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    this.totalDebit = Math.round(this.items.reduce((sum, item) => sum + (Number(item.debit) || 0), 0) * 100) / 100;
    this.totalCredit = Math.round(this.items.reduce((sum, item) => sum + (Number(item.credit) || 0), 0) * 100) / 100;
  }

  if (!this.entryNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.entryNumber = `JE/${new Date().getFullYear()}/${timestamp}${random}`;
  }

  next();
});

// Indexes for query performance and integrity
journalEntrySchema.index({ entryNumber: 1 }, { unique: true, sparse: true });
journalEntrySchema.index({ journal: 1, status: 1 });
journalEntrySchema.index({ date: -1, status: 1 });
journalEntrySchema.index({ 'items.account': 1 });

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

module.exports = JournalEntry;
