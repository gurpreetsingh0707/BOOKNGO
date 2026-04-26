const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Train = require('../models/Train');
const Bus = require('../models/Bus');
const Hotel = require('../models/Hotel');
const Flight = require('../models/Flight');

// Helper to get service model by type
const getServiceModel = (serviceType) => {
  const models = {
    movie: Movie,
    train: Train,
    bus: Bus,
    hotel: Hotel,
    flight: Flight
  };
  return models[serviceType?.toLowerCase()] || null;
};

// =============================================
// LISTING ENDPOINTS (called by frontend pages)
// =============================================

// Get all trains (for Trains page)
// Maps DB field names to what the frontend expects
exports.listTrains = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { isActive: true };

    if (from) query.source = { $regex: from, $options: 'i' };
    if (to) query.destination = { $regex: to, $options: 'i' };

    const dbTrains = await Train.find(query);

    // Map to the field names the frontend expects
    const trains = dbTrains.map(t => ({
      _id: t._id,
      name: t.trainName,
      trainNumber: t.trainNumber,
      from: t.source,
      to: t.destination,
      departureTime: t.departureTime,
      arrivalTime: t.arrivalTime,
      duration: t.duration,
      totalSeats: t.totalSeats,
      availableSeats: t.availableSeats,
      bookedSeats: t.bookedSeats,
      price: t.pricePerSeat,
      seatClass: t.seatClass,
      rating: t.rating,
      facilities: t.facilities,
      runDays: t.runDays,
      isActive: t.isActive
    }));

    res.status(200).json({
      success: true,
      trains,
      count: trains.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all buses (for Buses page)
exports.listBuses = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { isActive: true };

    if (from) query.from = { $regex: from, $options: 'i' };
    if (to) query.to = { $regex: to, $options: 'i' };

    const buses = await Bus.find(query);

    res.status(200).json({
      success: true,
      buses,
      count: buses.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all hotels (for Hotels page)
exports.listHotels = async (req, res) => {
  try {
    const { city } = req.query;
    const query = { isActive: true };

    if (city) query.city = { $regex: city, $options: 'i' };

    const hotels = await Hotel.find(query);

    res.status(200).json({
      success: true,
      hotels,
      count: hotels.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all flights (for Flights page)
exports.listFlights = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { isActive: true };

    if (from) query.source = { $regex: from, $options: 'i' };
    if (to) query.destination = { $regex: to, $options: 'i' };

    const dbFlights = await Flight.find(query);

    // Map to the field names the frontend expects
    const flights = dbFlights.map(f => ({
      _id: f._id,
      name: f.flightName,
      flightNumber: f.flightNumber,
      airline: f.airline,
      from: f.source,
      to: f.destination,
      departureTime: f.departureTime,
      arrivalTime: f.arrivalTime,
      duration: f.duration,
      totalSeats: f.totalSeats,
      availableSeats: f.availableSeats,
      bookedSeats: f.bookedSeats,
      price: f.price,
      classType: f.classType,
      rating: f.rating,
      amenities: f.amenities,
      stops: f.stops,
      aircraft: f.aircraft,
      isActive: f.isActive
    }));

    res.status(200).json({
      success: true,
      flights,
      count: flights.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// SERVICE-SPECIFIC BOOKING ENDPOINTS
// =============================================

// Book a flight
exports.bookFlight = async (req, res) => {
  try {
    const { flightId, seats, travelDate } = req.body;
    const userId = req.user._id;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    const seatCount = seats || 1;
    const available = flight.availableSeats - flight.bookedSeats;
    if (seatCount > available) {
      return res.status(400).json({ success: false, message: `Only ${available} seats available` });
    }

    const totalPrice = flight.price * seatCount;

    const booking = new Booking({
      userId,
      bookingType: 'flight',
      bookingDetails: {
        serviceId: flight._id,
        serviceName: flight.flightName
      },
      quantity: seatCount,
      totalPrice,
      travelDate: travelDate || new Date(),
      bookingStatus: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    flight.bookedSeats += seatCount;
    await flight.save();

    res.status(201).json({
      success: true,
      message: 'Flight booked successfully',
      booking,
      totalPrice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Book a movie
exports.bookMovie = async (req, res) => {
  try {
    const { movieId, seats, travelDate } = req.body;
    const userId = req.user._id;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const seatCount = seats || 1;
    const available = movie.availableSeats - movie.bookedSeats;
    if (seatCount > available) {
      return res.status(400).json({ success: false, message: `Only ${available} seats available` });
    }

    const totalPrice = movie.price * seatCount;

    const booking = new Booking({
      userId,
      bookingType: 'movie',
      bookingDetails: {
        serviceId: movie._id,
        serviceName: movie.title
      },
      quantity: seatCount,
      totalPrice,
      travelDate: travelDate || new Date(),
      bookingStatus: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    movie.bookedSeats += seatCount;
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

// Book a train
exports.bookTrain = async (req, res) => {
  try {
    const { trainId, seats, travelDate } = req.body;
    const userId = req.user._id;

    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found' });
    }

    const seatCount = seats || 1;
    const available = train.availableSeats - train.bookedSeats;
    if (seatCount > available) {
      return res.status(400).json({ success: false, message: `Only ${available} seats available` });
    }

    const totalPrice = train.pricePerSeat * seatCount;

    const booking = new Booking({
      userId,
      bookingType: 'train',
      bookingDetails: {
        serviceId: train._id,
        serviceName: train.trainName
      },
      quantity: seatCount,
      totalPrice,
      travelDate: travelDate || new Date(),
      bookingStatus: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    train.bookedSeats += seatCount;
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

// Book a bus
exports.bookBus = async (req, res) => {
  try {
    const { busId, seats, travelDate } = req.body;
    const userId = req.user._id;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    const seatCount = seats || 1;
    const available = bus.availableSeats - bus.bookedSeats;
    if (seatCount > available) {
      return res.status(400).json({ success: false, message: `Only ${available} seats available` });
    }

    const totalPrice = bus.price * seatCount;

    const booking = new Booking({
      userId,
      bookingType: 'bus',
      bookingDetails: {
        serviceId: bus._id,
        serviceName: bus.name
      },
      quantity: seatCount,
      totalPrice,
      travelDate: travelDate || new Date(),
      bookingStatus: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    bus.bookedSeats += seatCount;
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

// Book a hotel
exports.bookHotel = async (req, res) => {
  try {
    const { hotelId, rooms, checkInDate, checkOutDate } = req.body;
    const userId = req.user._id;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    const roomCount = rooms || 1;
    const available = hotel.availableRooms - hotel.bookedRooms;
    if (roomCount > available) {
      return res.status(400).json({ success: false, message: `Only ${available} rooms available` });
    }

    const checkIn = new Date(checkInDate || Date.now());
    const checkOut = new Date(checkOutDate || Date.now() + 86400000);
    const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
    const totalPrice = hotel.pricePerNight * roomCount * nights;

    const booking = new Booking({
      userId,
      bookingType: 'hotel',
      bookingDetails: {
        serviceId: hotel._id,
        serviceName: hotel.name,
        numberOfDays: nights
      },
      quantity: roomCount,
      totalPrice,
      travelDate: checkInDate || new Date(),
      bookingStatus: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    hotel.bookedRooms += roomCount;
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

// =============================================
// GENERIC BOOKING CRUD ENDPOINTS
// =============================================

// Create a new booking (generic)
exports.createBooking = async (req, res) => {
  try {
    const {
      serviceType,
      serviceId,
      serviceName,
      numberOfSeats,
      numberOfRooms,
      numberOfDays,
      pricePerUnit,
      totalPrice,
      passengerDetails,
      travelDate,
      paymentMethod,
      notes
    } = req.body;
    const userId = req.user._id;

    if (!serviceType || !serviceId || !serviceName || !pricePerUnit || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'serviceType, serviceId, serviceName, pricePerUnit, and totalPrice are required'
      });
    }

    const ServiceModel = getServiceModel(serviceType);
    if (ServiceModel) {
      const service = await ServiceModel.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: `${serviceType} not found`
        });
      }
    }

    const booking = new Booking({
      userId,
      bookingType: serviceType,
      bookingDetails: {
        serviceId,
        serviceName,
        passengerDetails: passengerDetails || []
      },
      quantity: numberOfSeats || numberOfRooms || 1,
      totalPrice,
      travelDate: travelDate || new Date(),
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      notes
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { serviceType, bookingStatus, paymentStatus, page = 1, limit = 20 } = req.query;

    const query = {};
    if (serviceType) query.bookingType = serviceType;
    if (bookingStatus) query.bookingStatus = bookingStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const bookings = await Booking.find(query)
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      totalBookings: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { serviceType, bookingStatus } = req.query;

    const query = { userId };
    if (serviceType) query.bookingType = serviceType;
    if (bookingStatus) query.bookingStatus = bookingStatus;

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      totalBookings: bookings.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get specific booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId)
      .populate('userId', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot update a cancelled booking' });
    }

    if (booking.bookingStatus === 'confirmed') {
      return res.status(400).json({ success: false, message: 'Cannot update a confirmed booking' });
    }

    const allowedUpdates = ['numberOfSeats', 'numberOfRooms', 'numberOfDays', 'passengerDetails', 'travelDate', 'notes'];
    const updates = {};
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        updates[key] = updateData[key];
      }
    }

    if (updates.numberOfSeats || updates.numberOfRooms || updates.numberOfDays) {
      const seats = updates.numberOfSeats || booking.numberOfSeats;
      const rooms = updates.numberOfRooms || booking.numberOfRooms;
      const days = updates.numberOfDays || booking.numberOfDays;

      if (booking.serviceType === 'hotel') {
        updates.totalPrice = booking.pricePerUnit * rooms * days;
      } else {
        updates.totalPrice = booking.pricePerUnit * seats;
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = booking.paymentStatus === 'completed' ? 'refunded' : booking.paymentStatus;
    booking.cancellationReason = cancellationReason || '';
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Confirm booking (payment success)
exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;
    const { transactionId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot confirm a cancelled booking' });
    }

    if (booking.bookingStatus === 'confirmed') {
      return res.status(400).json({ success: false, message: 'Booking already confirmed' });
    }

    booking.bookingStatus = 'confirmed';
    booking.paymentStatus = 'completed';
    booking.transactionId = transactionId || '';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};