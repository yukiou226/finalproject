const express = require('express');
const path = require('path');
const app = express();
const recipeRoutes = require('./routes/recipes');
app.use('/recipes', recipeRoutes);


// Add this line to specify the views directory
app.set('views', path.join(__dirname, '../views'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// (Other middleware and routing setup...)

module.exports = app;
