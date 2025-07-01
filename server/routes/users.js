// File: routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  console.log('📝 Registration request received:', req.body);
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    console.log('❌ Missing fields:', { name: !!name, email: !!email, password: !!password, password2: !!password2 });
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    console.log('❌ Validation errors:', errors);
    return res.status(400).json({ errors });
  }

  try {
    console.log('🔍 Checking if user exists:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ msg: 'Email already registered' });
    }

    console.log('✅ Creating new user:', { name, email });
    const newUser = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    console.log('✅ User saved successfully:', newUser._id);
    res.status(200).json({ msg: 'Registration successful' });
  } catch (err) {
    console.error('❌ Error in registration:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('🔑 Login request received:', { email: req.body.email });
  const { email, password } = req.body;
  let errors = [];
  if (!email || !password) {
    console.log('❌ Missing login fields:', { email: !!email, password: !!password });
    errors.push({ msg: 'Please fill in all fields' });
  }
  if (errors.length > 0) {
    console.log('❌ Login validation errors:', errors);
    return res.status(400).json({ errors });
  }
  try {
    console.log('🔍 Looking for user:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    console.log('✅ User found, checking password');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    console.log('✅ Login successful for user:', user._id);
    
    // For now, just return success. Later you can add session/JWT logic
    res.status(200).json({ 
      msg: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Error in login:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
