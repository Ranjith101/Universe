const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Generate a random secret key for JWT token signing
const secretKey = crypto.randomBytes(32).toString('hex');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const user = new User({ name, email, password });
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, secretKey);
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
