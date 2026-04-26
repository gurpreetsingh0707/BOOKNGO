const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  searchBuses,
  bookSeats
} = require('../controllers/busController');

// Public routes
router.get('/', getAllBuses);
router.get('/search', searchBuses);
router.get('/:id', getBusById);

// Protected routes (Admin only)
router.post('/', verifyToken, createBus);
router.put('/:id', verifyToken, updateBus);
router.delete('/:id', verifyToken, deleteBus);

// Booking
router.patch('/:id/book-seats', verifyToken, bookSeats);

module.exports = router;
