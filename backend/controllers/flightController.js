const Flight = require('../models/Flight');

// GET all flights
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find({ isActive: true });
    
    const mappedFlights = flights.map(f => ({
      ...f._doc,
      name: f.flightName,
      from: f.source,
      to: f.destination
    }));

    res.status(200).json({
      success: true,
      message: 'Flights fetched successfully',
      flights: mappedFlights,
      count: mappedFlights.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET flight by ID
exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE new flight (Admin only)
exports.createFlight = async (req, res) => {
  try {
    const { flightName, flightNumber, airline, source, destination, price, classType } = req.body;

    if (!flightName || !flightNumber || !airline || !source || !destination || !price || !classType) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const existingFlight = await Flight.findOne({ flightNumber });
    if (existingFlight) {
      return res.status(409).json({
        success: false,
        message: 'Flight with this number already exists'
      });
    }

    const newFlight = new Flight({
      flightName,
      flightNumber,
      airline,
      source,
      destination,
      price,
      classType,
      ...req.body
    });

    const savedFlight = await newFlight.save();

    res.status(201).json({
      success: true,
      message: 'Flight created successfully',
      data: savedFlight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE flight
exports.updateFlight = async (req, res) => {
  try {
    const updatedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFlight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Flight updated successfully',
      data: updatedFlight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE flight (soft delete)
exports.deleteFlight = async (req, res) => {
  try {
    const deletedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deletedFlight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Flight deleted successfully',
      data: deletedFlight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search flights
exports.searchFlights = async (req, res) => {
  try {
    const { source, destination, classType } = req.query;

    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination are required'
      });
    }

    let query = {
      source: { $regex: source, $options: 'i' },
      destination: { $regex: destination, $options: 'i' },
      isActive: true
    };

    if (classType) {
      query.classType = classType;
    }

    const flights = await Flight.find(query);

    const mappedFlights = flights.map(f => ({
      ...f._doc,
      name: f.flightName,
      from: f.source,
      to: f.destination
    }));

    res.status(200).json({
      success: true,
      flights: mappedFlights,
      count: mappedFlights.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Book seats
exports.bookSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatsToBook } = req.body;

    if (!seatsToBook || seatsToBook <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid number of seats is required'
      });
    }

    const flight = await Flight.findById(id);
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    const currentAvailable = flight.availableSeats - flight.bookedSeats;
    
    if (seatsToBook > currentAvailable) {
      return res.status(400).json({
        success: false,
        message: `Only ${currentAvailable} seats available`
      });
    }

    flight.bookedSeats += seatsToBook;
    const updatedFlight = await flight.save();

    res.status(200).json({
      success: true,
      message: 'Seats booked successfully',
      data: updatedFlight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
