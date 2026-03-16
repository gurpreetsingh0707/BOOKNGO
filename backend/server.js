const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== DATABASE CONNECTION ====================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/BOOKNGO')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));


// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});