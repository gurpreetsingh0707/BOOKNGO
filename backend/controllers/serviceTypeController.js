const ServiceType = require('../models/ServiceType');

// GET all service types
const getAllServiceTypes = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find({ isActive: true })
      .sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      data: serviceTypes,
      count: serviceTypes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE new service type (Admin only)
const createServiceType = async (req, res) => {
  try {
    const { name, description, icon, apiProvider, apiEndpoint, apiKey } = req.body;

    if (!name || !apiProvider) {
      return res.status(400).json({
        success: false,
        message: 'Name and API provider are required'
      });
    }

    const newServiceType = new ServiceType({
      name,
      description,
      icon,
      apiProvider,
      apiEndpoint,
      apiKey
    });

    const savedServiceType = await newServiceType.save();

    res.status(201).json({
      success: true,
      message: 'Service type created successfully',
      data: savedServiceType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE service type (Admin only)
const updateServiceType = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedServiceType = await ServiceType.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedServiceType) {
      return res.status(404).json({
        success: false,
        message: 'Service type not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service type updated successfully',
      data: updatedServiceType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE service type (Admin only)
const deleteServiceType = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedServiceType = await ServiceType.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedServiceType) {
      return res.status(404).json({
        success: false,
        message: 'Service type not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service type deleted successfully',
      data: deletedServiceType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllServiceTypes,
  createServiceType,
  updateServiceType,
  deleteServiceType
};