const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: {
      type: String,
      trim: true
    },
    paymentType: {
      type: String,
      enum: ['send_money', 'receive_money'],
      required: true
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0.01, 'Payment amount must be greater than zero']
    },
    paymentMethod: {
      type: String,
      enum: ['Bank', 'Cash'],
      default: 'Bank'
    },
    journal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journal',
      default: null
    },
    vendorBill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendorBill',
      default: null
    },
    customerInvoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomerInvoice',
      default: null
    },
    status: {
      type: String,
      enum: ['draft', 'posted', 'cancelled'],
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

paymentSchema.pre('save', function (next) {
  if (!this.paymentNumber) {
    const prefix = this.paymentType === 'send_money' ? 'PAY-OUT' : 'PAY-IN';
    const timestamp = Date.now().toString().slice(-6);
    this.paymentNumber = `${prefix}/${new Date().getFullYear()}/${timestamp}`;
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
