const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getAllTrains,
  getTrainById,
  createTrain,
  updateTrain,
  deleteTrain,
  searchTrains
} = require('../controllers/trainController');

// Public routes
router.get('/', getAllTrains);
router.get('/search', searchTrains);
router.get('/:id', getTrainById);

// Protected routes (Admin only)
router.post('/', verifyToken, createTrain);
router.put('/:id', verifyToken, updateTrain);
router.delete('/:id', verifyToken, deleteTrain);

module.exports = router;