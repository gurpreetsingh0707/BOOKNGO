const express = require('express');
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

const router = express.Router();

// Movie Routes
router.post('/movie', auth, bookingController.bookMovie);
router.get('/movies', bookingController.getAllMovies);

// Train Routes
router.post('/train', auth, bookingController.bookTrain);
router.get('/trains', bookingController.getAllTrains);

// Bus Routes
router.post('/bus', auth, bookingController.bookBus);
router.get('/buses', bookingController.getAllBuses);

// Hotel Routes
router.post('/hotel', auth, bookingController.bookHotel);
router.get('/hotels', bookingController.getAllHotels);

// User Bookings
router.get('/user', auth, bookingController.getUserBookings);
router.get('/:bookingId', auth, bookingController.getBooking);
router.delete('/:bookingId', auth, bookingController.cancelBooking);

module.exports = router;