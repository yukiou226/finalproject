const express = require('express');
const router = express.Router();
const path = require('path');
const { ensureAuthenticated } = require('../auth/authMiddleware');
const Recipe = require('../models/Recipe');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const recipes = await Recipe.find({ author: req.user.id });
  res.render('dashboard', { user: req.user, recipes });
});

module.exports = router;