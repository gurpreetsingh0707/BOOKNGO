const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

const User = require('../models/User');

// Middleware to check admin (Strictly for Owner account)
const adminAuth = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const user = await User.findById(req.user._id);
        
        // STRICTOR CHECK: Only allow nargourav54@gmail.com
        const OWNER_EMAIL = 'nargourav54@gmail.com';
        
        if (!user || user.email !== OWNER_EMAIL || !['admin', 'super-admin'].includes(user.role)) {
            return res.status(403).json({ success: false, message: 'Access Denied: Owner account required' });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error during auth' });
    }
};

// ==================== BOOKINGS ====================
router.get('/bookings', auth, adminAuth, adminController.getAllBookings);
router.get('/bookings/:bookingId', auth, adminAuth, adminController.getBookingDetails);
router.delete('/bookings/:bookingId/cancel', auth, adminAuth, adminController.cancelBookingAdmin);

// ==================== USERS ====================
router.get('/users', auth, adminAuth, adminController.getAllUsers);
router.get('/users/:userId', auth, adminAuth, adminController.getUserDetails);
router.patch('/users/:userId/deactivate', auth, adminAuth, adminController.deactivateUser);

// ==================== MOVIES ====================
router.get('/movies', auth, adminAuth, adminController.getAllMoviesAdmin);
router.post('/movies', auth, adminAuth, adminController.addMovie);
router.patch('/movies/:movieId', auth, adminAuth, adminController.updateMovie);
router.delete('/movies/:movieId', auth, adminAuth, adminController.deleteMovie);

// ==================== TRAINS ====================
router.get('/trains', auth, adminAuth, adminController.getAllTrainsAdmin);
router.post('/trains', auth, adminAuth, adminController.addTrain);
router.patch('/trains/:trainId', auth, adminAuth, adminController.updateTrain);
router.delete('/trains/:trainId', auth, adminAuth, adminController.deleteTrain);

// ==================== BUSES ====================
router.get('/buses', auth, adminAuth, adminController.getAllBusesAdmin);
router.post('/buses', auth, adminAuth, adminController.addBus);
router.patch('/buses/:busId', auth, adminAuth, adminController.updateBus);
router.delete('/buses/:busId', auth, adminAuth, adminController.deleteBus);

// ==================== HOTELS ====================
router.get('/hotels', auth, adminAuth, adminController.getAllHotelsAdmin);
router.post('/hotels', auth, adminAuth, adminController.addHotel);
router.patch('/hotels/:hotelId', auth, adminAuth, adminController.updateHotel);
router.delete('/hotels/:hotelId', auth, adminAuth, adminController.deleteHotel);

// ==================== FLIGHTS ====================
router.get('/flights', auth, adminAuth, adminController.getAllFlightsAdmin);
router.post('/flights', auth, adminAuth, adminController.addFlight);
router.patch('/flights/:flightId', auth, adminAuth, adminController.updateFlight);
router.delete('/flights/:flightId', auth, adminAuth, adminController.deleteFlight);

// ==================== ANALYTICS ====================
router.get('/stats/dashboard', auth, adminAuth, adminController.getDashboardStats);
router.get('/stats/revenue', auth, adminAuth, adminController.getRevenueStats);

module.exports = router;