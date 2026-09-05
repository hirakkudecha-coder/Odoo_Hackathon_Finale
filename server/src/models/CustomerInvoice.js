const mongoose = require('mongoose');

const customerInvoiceItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  taxPercent: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    default: 0
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    default: null
  },
  analyticAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalyticAccount',
    default: null
  }
});

const customerInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      trim: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: [true, 'Customer is required for Customer Invoice']
    },
    salesOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalesOrder',
      default: null
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    items: {
      type: [customerInvoiceItemSchema],
      required: true,
      validate: [items => items.length > 0, 'At least one item is required in Customer Invoice']
    },
    untaxedAmount: {
      type: Number,
      default: 0
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'posted', 'paid', 'partial', 'cancelled'],
      default: 'draft'
    },
    journalEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JournalEntry',
      default: null
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Calculate item subtotals, taxes, and total amounts
customerInvoiceSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    let untaxed = 0;
    let tax = 0;

    this.items.forEach(item => {
      const lineBase = Math.round(item.quantity * item.unitPrice * 100) / 100;
      const lineTax = item.taxPercent ? Math.round((lineBase * (item.taxPercent / 100)) * 100) / 100 : 0;
      item.taxAmount = lineTax;
      item.subtotal = Math.round((lineBase + lineTax) * 100) / 100;

      untaxed += lineBase;
      tax += lineTax;
    });

    this.untaxedAmount = Math.round(untaxed * 100) / 100;
    this.taxAmount = Math.round(tax * 100) / 100;
    this.totalAmount = Math.round((untaxed + tax) * 100) / 100;
  }

  if (!this.invoiceNumber) {
    const timestamp = Date.now().toString().slice(-6);
    this.invoiceNumber = `INV/${new Date().getFullYear()}/${timestamp}`;
  }

  next();
});

// Indexes for query performance and integrity
customerInvoiceSchema.index({ invoiceNumber: 1 }, { unique: true, sparse: true });
customerInvoiceSchema.index({ customer: 1, status: 1 });
customerInvoiceSchema.index({ invoiceDate: -1, status: 1 });

const CustomerInvoice = mongoose.model('CustomerInvoice', customerInvoiceSchema);

module.exports = CustomerInvoice;
