const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
dbName = 'yukifoodblog';
mongoose.connect(`mongodb://127.0.0.1:27017/yukifoodblog`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ Connection error:', err));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// View setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const recipeRoutes = require('./routes/recipes');
app.use('/recipes', recipeRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;