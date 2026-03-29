const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Train = require('../models/Train');
const Bus = require('../models/Bus');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

// Movie Booking
exports.bookMovie = async (req, res) => {
  try {
    const { movieId, seats, travelDate } = req.body;
    const userId = req.user._id;

    // Get movie details
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Check seat availability
    if (movie.availableSeats < seats) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    // Calculate total price
    const totalPrice = movie.price * seats;

    // Create booking
    const booking = new Booking({
      userId,
      bookingType: 'movie',
      bookingDetails: {
        movieId: movie._id,
        movieTitle: movie.title,
        language: movie.language,
        duration: movie.duration,
        seats: seats
      },
      totalPrice,
      quantity: seats,
      travelDate: travelDate || new Date()
    });

    await booking.save();

    // Update available seats
    movie.availableSeats -= seats;
    movie.bookedSeats += seats;
    await movie.save();

    res.status(201).json({
      success: true,
      message: 'Movie booked successfully',
      booking,
      totalPrice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Train Booking
exports.bookTrain = async (req, res) => {
  try {
    const { trainId, seats, travelDate } = req.body;
    const userId = req.user._id;

    // Get train details
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found' });
    }

    // Check seat availability
    if (train.availableSeats < seats) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    // Calculate total price
    const totalPrice = train.price * seats;

    // Create booking
    const booking = new Booking({
      userId,
      bookingType: 'train',
      bookingDetails: {
        trainId: train._id,
        trainName: train.name,
        trainNumber: train.trainNumber,
        from: train.from,
        to: train.to,
        seatClass: train.seatClass,
        seats: seats
      },
      totalPrice,
      quantity: seats,
      travelDate
    });

    await booking.save();

    // Update available seats
    train.availableSeats -= seats;
    train.bookedSeats += seats;
    await train.save();

    res.status(201).json({
      success: true,
      message: 'Train booked successfully',
      booking,
      totalPrice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bus Booking
exports.bookBus = async (req, res) => {
  try {
    const { busId, seats, travelDate } = req.body;
    const userId = req.user._id;

    // Get bus details
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    // Check seat availability
    if (bus.availableSeats < seats) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    // Calculate total price
    const totalPrice = bus.price * seats;

    // Create booking
    const booking = new Booking({
      userId,
      bookingType: 'bus',
      bookingDetails: {
        busId: bus._id,
        busName: bus.name,
        busNumber: bus.busNumber,
        from: bus.from,
        to: bus.to,
        busType: bus.busType,
        seats: seats
      },
      totalPrice,
      quantity: seats,
      travelDate
    });

    await booking.save();

    // Update available seats
    bus.availableSeats -= seats;
    bus.bookedSeats += seats;
    await bus.save();

    res.status(201).json({
      success: true,
      message: 'Bus booked successfully',
      booking,
      totalPrice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Hotel Booking
exports.bookHotel = async (req, res) => {
  try {
    const { hotelId, rooms, checkInDate, checkOutDate } = req.body;
    const userId = req.user._id;

    // Get hotel details
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    // Check room availability
    if (hotel.availableRooms < rooms) {
      return res.status(400).json({ success: false, message: 'Not enough rooms available' });
    }

    // Calculate nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // Calculate total price
    const totalPrice = hotel.pricePerNight * rooms * nights;

    // Create booking
    const booking = new Booking({
      userId,
      bookingType: 'hotel',
      bookingDetails: {
        hotelId: hotel._id,
        hotelName: hotel.name,
        city: hotel.city,
        roomType: hotel.roomType,
        rooms: rooms,
        checkInDate,
        checkOutDate,
        nights
      },
      totalPrice,
      quantity: rooms,
      travelDate: checkInDate
    });

    await booking.save();

    // Update available rooms
    hotel.availableRooms -= rooms;
    hotel.bookedRooms += rooms;
    await hotel.save();

    res.status(201).json({
      success: true,
      message: 'Hotel booked successfully',
      booking,
      totalPrice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 });

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No bookings found',
        bookings: []
      });
    }

    res.status(200).json({
      success: true,
      bookings,
      totalBookings: bookings.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Booking
exports.getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Check if already cancelled
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    // Refund seats/rooms
    if (booking.bookingType === 'movie') {
      const movie = await Movie.findById(booking.bookingDetails.movieId);
      if (movie) {
        movie.availableSeats += booking.quantity;
        movie.bookedSeats -= booking.quantity;
        await movie.save();
      }
    } else if (booking.bookingType === 'train') {
      const train = await Train.findById(booking.bookingDetails.trainId);
      if (train) {
        train.availableSeats += booking.quantity;
        train.bookedSeats -= booking.quantity;
        await train.save();
      }
    } else if (booking.bookingType === 'bus') {
      const bus = await Bus.findById(booking.bookingDetails.busId);
      if (bus) {
        bus.availableSeats += booking.quantity;
        bus.bookedSeats -= booking.quantity;
        await bus.save();
      }
    } else if (booking.bookingType === 'hotel') {
      const hotel = await Hotel.findById(booking.bookingDetails.hotelId);
      if (hotel) {
        hotel.availableRooms += booking.quantity;
        hotel.bookedRooms -= booking.quantity;
        await hotel.save();
      }
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.cancelledDate = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isActive: true });

    res.status(200).json({
      success: true,
      movies,
      totalMovies: movies.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Trains
exports.getAllTrains = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { isActive: true };

    if (from) query.from = from;
    if (to) query.to = to;

    const trains = await Train.find(query);

    res.status(200).json({
      success: true,
      trains,
      totalTrains: trains.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Buses
exports.getAllBuses = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { isActive: true };

    if (from) query.from = from;
    if (to) query.to = to;

    const buses = await Bus.find(query);

    res.status(200).json({
      success: true,
      buses,
      totalBuses: buses.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Hotels
exports.getAllHotels = async (req, res) => {
  try {
    const { city } = req.query;
    const query = { isActive: true };

    if (city) query.city = city;

    const hotels = await Hotel.find(query);

    res.status(200).json({
      success: true,
      hotels,
      totalHotels: hotels.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};