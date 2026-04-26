const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightName: {
    type: String,
    required: true
  },
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  airline: {
    type: String,
    required: true
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
    default: 180
  },
  availableSeats: {
    type: Number,
    default: 180
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  classType: {
    type: String,
    enum: ['economy', 'premium_economy', 'business', 'first'],
    required: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  amenities: [String],
  stops: {
    type: Number,
    default: 0
  },
  aircraft: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
