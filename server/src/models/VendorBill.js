const mongoose = require('mongoose');

const vendorBillItemSchema = new mongoose.Schema({
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

const vendorBillSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      trim: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: [true, 'Vendor is required for Vendor Bill']
    },
    purchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PurchaseOrder',
      default: null
    },
    billDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    items: {
      type: [vendorBillItemSchema],
      required: true,
      validate: [items => items.length > 0, 'At least one item is required in Vendor Bill']
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

// Calculate subtotals and totalAmount
vendorBillSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      item.subtotal = Math.round(item.quantity * item.unitPrice * 100) / 100;
    });
    this.totalAmount = Math.round(this.items.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;
  }

  if (!this.billNumber) {
    const timestamp = Date.now().toString().slice(-6);
    this.billNumber = `BILL/${new Date().getFullYear()}/${timestamp}`;
  }

  next();
});

// Indexes for query performance and integrity
vendorBillSchema.index({ billNumber: 1 }, { unique: true, sparse: true });
vendorBillSchema.index({ vendor: 1, status: 1 });
vendorBillSchema.index({ billDate: -1, status: 1 });

const VendorBill = mongoose.model('VendorBill', vendorBillSchema);

module.exports = VendorBill;
