const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['movie', 'train', 'bus', 'hotel'],
    required: true
  },
  bookingDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentId: String,
  orderId: String,
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  travelDate: Date,
  cancelledDate: Date,
  notes: String
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;