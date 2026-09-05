const mongoose = require('mongoose');

const salesReceiptItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative']
  },
  totalPrice: {
    type: Number,
    default: 0
  }
});

const salesReceiptSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: [true, 'Receipt number is required'],
      trim: true
    },
    salesOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalesOrder',
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true
    },
    receiptDate: {
      type: Date,
      required: [true, 'Receipt date is required'],
      default: Date.now
    },
    items: {
      type: [salesReceiptItemSchema],
      required: true,
      validate: [items => items.length > 0, 'Receipt must contain at least one item']
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'delivered', 'cancelled'],
      default: 'draft'
    },
    notes: {
      type: String,
      default: ''
    },
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook: Number, Date, and Total Price calculation and validation
salesReceiptSchema.pre('save', function (next) {
  // 1. Date Validation
  if (!this.receiptDate || isNaN(new Date(this.receiptDate).getTime())) {
    return next(new Error('Invalid receipt date provided.'));
  }

  // 2. Number & Total Price Calculation
  if (this.items && this.items.length > 0) {
    let runningTotal = 0;
    for (const item of this.items) {
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        return next(new Error('Invalid item quantity. Quantity must be a positive number.'));
      }
      if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
        return next(new Error('Invalid unit price. Unit price must be a non-negative number.'));
      }

      item.totalPrice = Math.round(item.quantity * item.unitPrice * 100) / 100;
      runningTotal += item.totalPrice;
    }
    this.totalAmount = Math.round(runningTotal * 100) / 100;
  }

  // 3. Receipt Number check
  if (!this.receiptNumber) {
    const timestamp = Date.now().toString().slice(-6);
    this.receiptNumber = `SR/${new Date().getFullYear()}/${timestamp}`;
  }

  next();
});

// Indexes for query performance and integrity
salesReceiptSchema.index({ receiptNumber: 1 }, { unique: true, sparse: true });
salesReceiptSchema.index({ salesOrder: 1 });
salesReceiptSchema.index({ customer: 1, status: 1 });
salesReceiptSchema.index({ receiptDate: -1 });

const SalesReceipt = mongoose.model('SalesReceipt', salesReceiptSchema);

module.exports = SalesReceipt;
