const mongoose = require('mongoose');

const tradePartnerSchema = new mongoose.Schema(
  {
    partnerCode: {
      type: String,
      unique: true,
      required: true,
      default: () => `UF-GUILD-${Math.floor(1000 + Math.random() * 9000)}`
    },
    studioName: {
      type: String,
      required: [true, 'Studio or Company name is required'],
      trim: true
    },
    contactPerson: {
      type: String,
      required: [true, 'Principal contact person is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Official email address is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true
    },
    gstin: {
      type: String,
      trim: true,
      default: ''
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    procurementVolume: {
      type: Number,
      default: 2500000
    },
    tier: {
      type: String,
      enum: ['Silver Atelier', 'Gold Studio Guild', 'Platinum Master Guild'],
      default: 'Gold Studio Guild'
    },
    commissionRate: {
      type: Number,
      default: 28
    },
    status: {
      type: String,
      enum: ['approved', 'pending_review', 'active', 'suspended'],
      default: 'approved'
    }
  },
  {
    timestamps: true
  }
);

const TradePartner = mongoose.model('TradePartner', tradePartnerSchema);

module.exports = TradePartner;
