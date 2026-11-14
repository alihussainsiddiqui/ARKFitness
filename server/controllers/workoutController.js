const Workout = require('../models/Workout');
const mongoose = require('mongoose'); // Required for casting ObjectIds in Aggregation

// @desc    Get logged in user's workouts (Filtered by date)
// @route   GET /api/workouts?dateString=YYYY-MM-DD
const getWorkouts = async (req, res) => {
  try {
    const { dateString } = req.query;
    
    // Base query: always filter by the logged-in user
    const query = { user: req.user.id };
    
    // If the frontend sends a specific date from the Time Machine, filter by it
    if (dateString) {
      query.dateString = dateString;
    }

    const workouts = await Workout.find(query).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new workout
// @route   POST /api/workouts
const createWorkout = async (req, res) => {
  const { title, category, tags, exercises, dateString } = req.body;

  try {
    // Fallback just in case a dateString wasn't sent
    const workoutDate = dateString || new Date().toISOString().slice(0, 10);

    const workout = await Workout.create({
      user: req.user.id,
      dateString: workoutDate, // Saves the Time Machine date
      title,
      category,
      tags,
      exercises
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Ensure the logged-in user owns this workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await workout.deleteOne();
    res.json({ message: 'Workout removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    
    // Make sure logged in user matches the workout user
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });

    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { returnDocument: 'after' } 
    );
    res.status(200).json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get 7-day workout volume for Recharts
// @route   GET /api/workouts/stats/weekly
const getWeeklyActivity = async (req, res) => {
  try {
    // Generate an array of the last 7 dates (YYYY-MM-DD)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });

    const start = last7Days[0];
    const end = last7Days[6];

    // Aggregate workout volume
    const workouts = await Workout.aggregate([
      { 
        $match: { 
          // Must cast to ObjectId because aggregate doesn't auto-cast like find() does
          user: new mongoose.Types.ObjectId(req.user.id), 
          dateString: { $gte: start, $lte: end } 
        } 
      },
      { 
        $group: { 
          _id: '$dateString', 
          totalRoutines: { $sum: 1 }, 
          totalExercises: { $sum: { $size: "$exercises" } } 
        } 
      }
    ]);

    // Map the database results onto our 7-day array to ensure days with 0 workouts still appear
    const chartData = last7Days.map(dateStr => {
      const found = workouts.find(w => w._id === dateStr);
      const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      
      return {
        date: dateStr,
        day: dayName,
        routines: found ? found.totalRoutines : 0,
        exercises: found ? found.totalExercises : 0
      };
    });

    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getWorkouts, 
  createWorkout, 
  deleteWorkout, 
  getWorkoutById, 
  updateWorkout, 
  getWeeklyActivity 
};