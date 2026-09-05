const mongoose = require('mongoose');

const salesOrderItemSchema = new mongoose.Schema({
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
  }
});

const salesOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      trim: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: [true, 'Customer is required for Sales Order']
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    items: {
      type: [salesOrderItemSchema],
      required: true,
      validate: [items => items.length > 0, 'At least one item is required in Sales Order']
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
    status: {
      type: String,
      enum: ['draft', 'confirmed', 'delivered', 'invoiced', 'cancelled'],
      default: 'draft'
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

// Calculate subtotals, taxes, and total amounts
salesOrderSchema.pre('save', function (next) {
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

  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6);
    this.orderNumber = `SO/${new Date().getFullYear()}/${timestamp}`;
  }

  next();
});

const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);

module.exports = SalesOrder;
