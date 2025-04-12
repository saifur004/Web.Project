// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db/db'); // PostgreSQL DB connection

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Routes
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);

// PostgreSQL connection test
db.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected at:', result.rows[0].now);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
