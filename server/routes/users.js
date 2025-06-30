const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (password !== password2) errors.push({ msg: 'Passwords do not match' });
  if (errors.length > 0) return res.send(errors);

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.send('Email already registered');

  const newUser = new User({ name, email, password });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  await newUser.save();
  res.redirect('/login.html');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login.html',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login.html');
  });
});

module.exports = router;