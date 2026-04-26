const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
    const user = new User({ firstName, lastName, email, phone, password });
    await user.save();
    const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '7d' });
    res.status(201).json({ success: true, message: 'User registered', token, user: { _id: user._id, firstName, lastName, email, phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '7d' });
    res.status(200).json({ success: true, message: 'Login successful', token, user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email, phone: user.phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;