const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
  searchFlights,
  bookSeats
} = require('../controllers/flightController');

// Public routes
router.get('/', getAllFlights);
router.get('/search', searchFlights);
router.get('/:id', getFlightById);

// Protected routes (Admin only)
router.post('/', verifyToken, createFlight);
router.put('/:id', verifyToken, updateFlight);
router.delete('/:id', verifyToken, deleteFlight);

// Booking
router.patch('/:id/book-seats', verifyToken, bookSeats);

module.exports = router;
