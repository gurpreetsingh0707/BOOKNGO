const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getAllServiceTypes,
  createServiceType,
  updateServiceType,
  deleteServiceType
} = require('../controllers/serviceTypeController');

// Public routes
router.get('/', getAllServiceTypes);

// Admin routes (Protected)
router.post('/', verifyToken, createServiceType);
router.put('/:id', verifyToken, updateServiceType);
router.delete('/:id', verifyToken, deleteServiceType);

module.exports = router;