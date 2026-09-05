const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Customer', 'Vendor', 'Both'],
      default: 'Customer'
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    mobile: {
      type: String,
      trim: true
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' }
    },
    profileImage: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes for query performance and search
contactSchema.index({ email: 1 });
contactSchema.index({ type: 1, status: 1 });
contactSchema.index({ name: 1 });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
