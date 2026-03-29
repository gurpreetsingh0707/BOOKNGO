const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  genre: [String],
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  language: {
    type: String,
    required: true
  },
  duration: String,
  releaseDate: Date,
  price: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    default: 100
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  image: String,
  director: String,
  cast: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;