const express = require('express');
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

const router = express.Router();

// =============================================
// Listing endpoints (called by frontend pages)
// =============================================
router.get('/trains', bookingController.listTrains);
router.get('/buses', bookingController.listBuses);
router.get('/hotels', bookingController.listHotels);
router.get('/flights', bookingController.listFlights);

// =============================================
// Service-specific booking endpoints
// =============================================
router.post('/movie', auth, bookingController.bookMovie);
router.post('/train', auth, bookingController.bookTrain);
router.post('/bus', auth, bookingController.bookBus);
router.post('/hotel', auth, bookingController.bookHotel);
router.post('/flight', auth, bookingController.bookFlight);

// =============================================
// Generic booking CRUD
// =============================================

// Create a new booking (generic)
router.post('/', auth, bookingController.createBooking);

// Get all bookings (admin)
router.get('/', bookingController.getAllBookings);

// Get user's bookings
router.get('/user', auth, bookingController.getUserBookings);

// Get specific booking by ID
router.get('/:bookingId', auth, bookingController.getBookingById);

// Update booking
router.put('/:bookingId', auth, bookingController.updateBooking);

// Cancel booking
router.delete('/:bookingId', auth, bookingController.cancelBooking);

// Confirm booking (payment success)
router.post('/:bookingId/confirm', auth, bookingController.confirmBooking);

module.exports = router;