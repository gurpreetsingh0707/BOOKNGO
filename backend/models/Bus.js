const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  busNumber: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  departureTime: String,
  arrivalTime: String,
  duration: String,
  totalSeats: {
    type: Number,
    default: 50
  },
  availableSeats: {
    type: Number,
    default: 50
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  busType: {
    type: String,
    enum: ['standard', 'deluxe', 'sleeper', 'premium'],
    required: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  amenities: [String],
  operator: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);
module.exports = Bus;