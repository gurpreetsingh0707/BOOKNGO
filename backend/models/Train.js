const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainName: {
    type: String,
    required: true,
    unique: true
  },
  trainNumber: {
    type: String,
    required: true,
    unique: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureTime: String,
  arrivalTime: String,
  duration: String,
  totalSeats: {
    type: Number,
    default: 500
  },
  availableSeats: {
    type: Number,
    default: 500
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  pricePerSeat: {
    type: Number,
    required: true
  },
  seatClass: {
    type: String,
    enum: ['general', 'sleeper', 'ac3', 'ac2', 'ac1'],
    required: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  facilities: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  runDays: [String]
}, { timestamps: true });

const Train = mongoose.model('Train', trainSchema);
module.exports = Train;