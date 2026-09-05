const mongoose = require('mongoose');

const showroomSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    cityKey: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    tier: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      required: true
    },
    area: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    hours: {
      type: String,
      default: ''
    },
    features: {
      type: [String],
      default: []
    },
    mapUrl: {
      type: String,
      default: ''
    },
    badge: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Showroom', showroomSchema);
