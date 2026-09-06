const mongoose = require('mongoose');

const purchaseOrderItemSchema = new mongoose.Schema({
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
  analyticAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalyticAccount',
    default: null
  }
});

const purchaseOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      trim: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: [true, 'Vendor is required']
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    items: {
      type: [purchaseOrderItemSchema],
      required: true,
      validate: [items => items.length > 0, 'At least one item is required in Purchase Order']
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'confirmed', 'received', 'billed', 'cancelled'],
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

// Calculate subtotals and totalAmount
purchaseOrderSchema.pre('save', async function (next) {
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      item.subtotal = Math.round(item.quantity * item.unitPrice * 100) / 100;
    });
    this.totalAmount = Math.round(this.items.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;
  }

  if (!this.orderNumber) {
    try {
      const count = await mongoose.model('PurchaseOrder').countDocuments();
      this.orderNumber = `P${String(count + 1).padStart(5, '0')}`;
    } catch (e) {
      const timestamp = Date.now().toString().slice(-5);
      this.orderNumber = `P${timestamp}`;
    }
  }

  next();
});

// Indexes for query performance and integrity
purchaseOrderSchema.index({ orderNumber: 1 }, { unique: true, sparse: true });
purchaseOrderSchema.index({ vendor: 1, status: 1 });
purchaseOrderSchema.index({ orderDate: -1, status: 1 });

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

module.exports = PurchaseOrder;
