const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Goods', 'Service', 'Combo'],
      default: 'Goods'
    },
    salesPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    taxPercent: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
