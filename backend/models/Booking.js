const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['movie', 'train', 'bus', 'hotel', 'flight'],
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
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentId: String,
  paymentDate: Date,
  orderId: String,
  travelDate: Date,
  bookingDate: {
    type: Date,
    default: Date.now
  },
  cancelledDate: Date,
  notes: String
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;