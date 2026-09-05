const mongoose = require('mongoose');

const showroomTourSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
      required: true,
      default: () => `UF-TOUR-${Math.floor(100000 + Math.random() * 900000)}`
    },
    showroom: {
      type: String,
      required: [true, 'Showroom atelier selection is required'],
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
      type: String,
      required: [true, 'Preferred tour date is required']
    },
    timeSlot: {
      type: String,
      default: '11:00 AM - 12:30 PM'
    },
    guests: {
      type: String,
      default: '2 Guests'
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['confirmed', 'rescheduled', 'completed', 'cancelled'],
      default: 'confirmed'
    }
  },
  {
    timestamps: true
  }
);

const ShowroomTour = mongoose.model('ShowroomTour', showroomTourSchema);

module.exports = ShowroomTour;
