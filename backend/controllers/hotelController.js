const Hotel = require('../models/Hotel');

// GET all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true });
    res.status(200).json({
      success: true,
      message: 'Hotels fetched successfully',
      data: hotels,
      count: hotels.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE new hotel (Admin only)
exports.createHotel = async (req, res) => {
  try {
    const { hotelName, location, city, pricePerNight } = req.body;

    // Validation
    if (!hotelName || !location || !city || !pricePerNight) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const newHotel = new Hotel({
      hotelName,
      location,
      city,
      pricePerNight,
      ...req.body
    });

    const savedHotel = await newHotel.save();

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: savedHotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE hotel
exports.updateHotel = async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hotel updated successfully',
      data: updatedHotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE hotel
exports.deleteHotel = async (req, res) => {
  try {
    const deletedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deletedHotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully',
      data: deletedHotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search hotels by city
exports.searchHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City is required'
      });
    }

    let query = {
      city: { $regex: city, $options: 'i' },
      isActive: true
    };

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = minPrice;
      if (maxPrice) query.pricePerNight.$lte = maxPrice;
    }

    const hotels = await Hotel.find(query);

    res.status(200).json({
      success: true,
      data: hotels,
      count: hotels.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Book rooms
exports.bookRooms = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomsToBook } = req.body;

    if (!roomsToBook || roomsToBook <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid number of rooms is required'
      });
    }

    const hotel = await Hotel.findById(id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    const currentAvailable = hotel.availableRooms - hotel.bookedRooms;
    
    if (roomsToBook > currentAvailable) {
      return res.status(400).json({
        success: false,
        message: `Only ${currentAvailable} rooms available`
      });
    }

    hotel.bookedRooms += roomsToBook;
    const updatedHotel = await hotel.save();

    res.status(200).json({
      success: true,
      message: 'Rooms booked successfully',
      data: updatedHotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};