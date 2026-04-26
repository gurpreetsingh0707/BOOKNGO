const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
  searchMovies,
  updateBookedSeats
} = require('../controllers/movieController');

// Public routes
router.get('/', getAllMovies);
router.get('/search', searchMovies);
router.get('/genre/:genre', getMoviesByGenre);
router.get('/:id', getMovieById);

// Protected routes (Admin only)
router.post('/', verifyToken, createMovie);
router.put('/:id', verifyToken, updateMovie);
router.delete('/:id', verifyToken, deleteMovie);

// Booking related
router.patch('/:id/book-seats', verifyToken, updateBookedSeats);

module.exports = router;