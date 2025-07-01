const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../auth/authMiddleware');
const Recipe = require('../models/Recipe');

router.post('/add', ensureAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).send('Missing fields');

  const newRecipe = new Recipe({
    title,
    content,
    author: req.user.id
  });
  await newRecipe.save();
  res.redirect('/dashboard');
});

module.exports = router;
