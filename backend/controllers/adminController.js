const Admin = require('../models/Admin');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Train = require('../models/Train');
const Bus = require('../models/Bus');
const Hotel = require('../models/Hotel');
const Flight = require('../models/Flight');

// ======================== BOOKINGS ========================

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const { status, type, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) query.bookingStatus = status;
        if (type) query.bookingType = type;

        const skip = (page - 1) * limit;

        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Booking.countDocuments(query);

        res.status(200).json({
            success: true,
            bookings,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: parseInt(page)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get booking details
exports.getBookingDetails = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel booking
exports.cancelBookingAdmin = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Already cancelled' });
        }

        booking.bookingStatus = 'cancelled';
        booking.cancelledDate = new Date();
        await booking.save();

        res.status(200).json({ success: true, message: 'Booking cancelled', booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================== USERS ========================

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments();

        res.status(200).json({
            success: true,
            users,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: parseInt(page)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user details
exports.getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            user,
            bookingsCount: bookings.length,
            totalSpent: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
            recentBookings: bookings.slice(0, 5)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Deactivate user
exports.deactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(
            userId,
            { isActive: false },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'User deactivated', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================== SERVICES ========================

// Get all movies
exports.getAllMoviesAdmin = async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, movies, total: movies.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add movie
exports.addMovie = async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();

        res.status(201).json({ success: true, message: 'Movie added', movie });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update movie
exports.updateMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const movie = await Movie.findByIdAndUpdate(movieId, req.body, { new: true });

        res.status(200).json({ success: true, message: 'Movie updated', movie });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete movie
exports.deleteMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        await Movie.findByIdAndDelete(movieId);

        res.status(200).json({ success: true, message: 'Movie deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Same for Trains, Buses, Hotels...
exports.getAllTrainsAdmin = async (req, res) => {
    try {
        const trains = await Train.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, trains, total: trains.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addTrain = async (req, res) => {
    try {
        const train = new Train(req.body);
        await train.save();
        res.status(201).json({ success: true, message: 'Train added', train });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateTrain = async (req, res) => {
    try {
        const { trainId } = req.params;
        const train = await Train.findByIdAndUpdate(trainId, req.body, { new: true });
        res.status(200).json({ success: true, message: 'Train updated', train });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteTrain = async (req, res) => {
    try {
        const { trainId } = req.params;
        await Train.findByIdAndDelete(trainId);
        res.status(200).json({ success: true, message: 'Train deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllBusesAdmin = async (req, res) => {
    try {
        const buses = await Bus.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, buses, total: buses.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addBus = async (req, res) => {
    try {
        const bus = new Bus(req.body);
        await bus.save();
        res.status(201).json({ success: true, message: 'Bus added', bus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateBus = async (req, res) => {
    try {
        const { busId } = req.params;
        const bus = await Bus.findByIdAndUpdate(busId, req.body, { new: true });
        res.status(200).json({ success: true, message: 'Bus updated', bus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteBus = async (req, res) => {
    try {
        const { busId } = req.params;
        await Bus.findByIdAndDelete(busId);
        res.status(200).json({ success: true, message: 'Bus deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllHotelsAdmin = async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, hotels, total: hotels.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addHotel = async (req, res) => {
    try {
        const hotel = new Hotel(req.body);
        await hotel.save();
        res.status(201).json({ success: true, message: 'Hotel added', hotel });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const hotel = await Hotel.findByIdAndUpdate(hotelId, req.body, { new: true });
        res.status(200).json({ success: true, message: 'Hotel updated', hotel });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        await Hotel.findByIdAndDelete(hotelId);
        res.status(200).json({ success: true, message: 'Hotel deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================== FLIGHTS ========================

exports.getAllFlightsAdmin = async (req, res) => {
    try {
        const flights = await Flight.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, flights, total: flights.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addFlight = async (req, res) => {
    try {
        const flight = new Flight(req.body);
        await flight.save();
        res.status(201).json({ success: true, message: 'Flight added', flight });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateFlight = async (req, res) => {
    try {
        const { flightId } = req.params;
        const flight = await Flight.findByIdAndUpdate(flightId, req.body, { new: true });
        res.status(200).json({ success: true, message: 'Flight updated', flight });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteFlight = async (req, res) => {
    try {
        const { flightId } = req.params;
        await Flight.findByIdAndDelete(flightId);
        res.status(200).json({ success: true, message: 'Flight deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================== ANALYTICS ========================

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalRevenue = await Booking.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const bookingsByType = await Booking.aggregate([
            { $group: { _id: '$bookingType', count: { $sum: 1 } } }
        ]);

        const bookingsByStatus = await Booking.aggregate([
            { $group: { _id: '$bookingStatus', count: { $sum: 1 } } }
        ]);

        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            stats: {
                totalBookings,
                totalUsers,
                totalRevenue: totalRevenue[0]?.total || 0,
                bookingsByType,
                bookingsByStatus,
                recentBookings
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get revenue stats
exports.getRevenueStats = async (req, res) => {
    try {
        const monthlyRevenue = await Booking.aggregate([
            { $match: { paymentStatus: 'completed' } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$paymentDate' } },
                    total: { $sum: '$totalPrice' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({ success: true, monthlyRevenue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};