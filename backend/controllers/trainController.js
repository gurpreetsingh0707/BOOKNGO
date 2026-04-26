const Train = require('../models/Train');

// CREATE new train
const createTrain = async (req, res) => {
  try {
    const { trainName, trainNumber, source, destination, departureTime, arrivalTime, pricePerSeat } = req.body;

    if (!trainName || !trainNumber || !source || !destination || !pricePerSeat) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const existingTrain = await Train.findOne({ trainNumber });
    if (existingTrain) {
      return res.status(409).json({
        success: false,
        message: 'Train with this number already exists'
      });
    }

    const newTrain = new Train({
      trainName,
      trainNumber,
      source,
      destination,
      departureTime,
      arrivalTime,
      pricePerSeat,
      ...req.body
    });

    const savedTrain = await newTrain.save();

    res.status(201).json({
      success: true,
      message: 'Train created successfully',
      data: savedTrain
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE train
const updateTrain = async (req, res) => {
  try {
    const updatedTrain = await Train.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTrain) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Train updated successfully',
      data: updatedTrain
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE train
const deleteTrain = async (req, res) => {
  try {
    const deletedTrain = await Train.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deletedTrain) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Train deleted successfully',
      data: deletedTrain
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET all trains
const getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find({ isActive: true });
    res.status(200).json({
      success: true,
      message: 'Trains fetched successfully',
      data: trains,
      count: trains.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET train by ID
const getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }

    res.status(200).json({
      success: true,
      data: train
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search trains by source and destination
const searchTrains = async (req, res) => {
  try {
    const { source, destination } = req.query;

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

    const trains = await Train.find(query);

    res.status(200).json({
      success: true,
      data: trains,
      count: trains.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllTrains,
  getTrainById,
  createTrain,
  updateTrain,
  deleteTrain,
  searchTrains
};