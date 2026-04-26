const express = require('express');
const router = express.Router();
const { searchByServiceType } = require('../services/searchService');

// Search by service type
router.post('/', async (req, res) => {
  try {
    const { serviceType, query } = req.body;

    if (!serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Service type is required'
      });
    }

    const results = await searchByServiceType(serviceType, query || {});

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;