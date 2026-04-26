const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  searchHotels,
  bookRooms
} = require('../controllers/hotelController');

// Public routes
router.get('/', getAllHotels);
router.get('/search', searchHotels);
router.get('/:id', getHotelById);

// Protected routes (Admin only)
router.post('/', verifyToken, createHotel);
router.put('/:id', verifyToken, updateHotel);
router.delete('/:id', verifyToken, deleteHotel);

// Booking
router.patch('/:id/book-rooms', verifyToken, bookRooms);

module.exports = router;