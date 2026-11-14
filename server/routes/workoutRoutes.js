const express = require('express');
const router = express.Router();
const { 
  getWorkouts, 
  getWorkoutById, 
  createWorkout, 
  updateWorkout,
  deleteWorkout,
  getWeeklyActivity
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

// The protect middleware runs first. If valid, it moves to the controller logic.
router.route('/').get(protect, getWorkouts).post(protect, createWorkout);
router.get('/stats/weekly', protect, getWeeklyActivity);

// All requests for a specific ID are grouped together here
router.route('/:id')
  .get(protect, getWorkoutById)
  .put(protect, updateWorkout)
  .delete(protect, deleteWorkout);

module.exports = router;