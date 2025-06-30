const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../auth/authMiddleware');
const Recipe = require('../models/Recipe');
const app = require('../app');


router.get('/', (req, res) => res.send('Welcome to Home'));

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const recipes = await Recipe.find({ author: req.user.id });
  res.render('dashboard', { user: req.user, recipes });
});

module.exports = router;