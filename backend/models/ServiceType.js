const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  icon: String,
  apiProvider: {
    type: String,
    enum: ['omdb', 'irctc', 'hotels', 'busybus', 'custom'],
    required: true
  },
  apiEndpoint: String,
  apiKey: String,
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const ServiceType = mongoose.model('ServiceType', serviceTypeSchema);
module.exports = ServiceType;