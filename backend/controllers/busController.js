const Bus = require('../models/Bus');

// GET all buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ isActive: true });
    res.status(200).json({
      success: true,
      message: 'Buses fetched successfully',
      data: buses,
      count: buses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET bus by ID
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      data: bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE new bus (Admin only)
exports.createBus = async (req, res) => {
  try {
    const { busName, busNumber, busOperator, source, destination, departureTime, pricePerSeat } = req.body;

    // Validation
    if (!busName || !busNumber || !busOperator || !source || !destination || !pricePerSeat) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(409).json({
        success: false,
        message: 'Bus with this number already exists'
      });
    }

    const newBus = new Bus({
      busName,
      busNumber,
      busOperator,
      source,
      destination,
      departureTime,
      pricePerSeat,
      ...req.body
    });

    const savedBus = await newBus.save();

    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      data: savedBus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE bus
exports.updateBus = async (req, res) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus updated successfully',
      data: updatedBus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE bus
exports.deleteBus = async (req, res) => {
  try {
    const deletedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deletedBus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus deleted successfully',
      data: deletedBus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search buses by source and destination
exports.searchBuses = async (req, res) => {
  try {
    const { source, destination, busType } = req.query;

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

    if (busType) {
      query.busType = busType;
    }

    const buses = await Bus.find(query);

    res.status(200).json({
      success: true,
      data: buses,
      count: buses.length
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

    const bus = await Bus.findById(id);
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    const currentAvailable = bus.availableSeats - bus.bookedSeats;
    
    if (seatsToBook > currentAvailable) {
      return res.status(400).json({
        success: false,
        message: `Only ${currentAvailable} seats available`
      });
    }

    bus.bookedSeats += seatsToBook;
    const updatedBus = await bus.save();

    res.status(200).json({
      success: true,
      message: 'Seats booked successfully',
      data: updatedBus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};