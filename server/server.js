const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contact');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize the Express app
const app = express();

// Middleware to parse JSON and allow cross-origin requests from React
app.use(express.json());
app.use(cors());

// Route imports
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

app.use('/api/nutrition', require('./routes/nutrition'));

app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/contact', contactRoutes);

const userRoutes = require('./routes/userRoutes'); // Add this import
app.use('/api/users', userRoutes); // Add this middleware



// Basic test route
app.get('/', (req, res) => {
  res.send('ARK Fitness API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});