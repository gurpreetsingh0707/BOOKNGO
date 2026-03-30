const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  city: {
    type: String,
    required: true
  },
  address: String,
  description: String,
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  totalRooms: {
    type: Number,
    default: 50
  },
  availableRooms: {
    type: Number,
    default: 50
  },
  bookedRooms: {
    type: Number,
    default: 0
  },
  roomType: {
    type: String,
    enum: ['single', 'double', 'suite', 'deluxe', 'luxury'],
    required: true
  },
  category: {
    type: String,
    enum: ['3-star', '4-star', '5-star', 'luxury', 'budget'],
    required: true
  },
  amenities: [String],
  facilities: [String],
  checkInTime: {
    type: String,
    default: '14:00'
  },
  checkOutTime: {
    type: String,
    default: '11:00'
  },
  image: String,
  phone: String,
  email: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;