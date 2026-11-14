const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  // Distinguishes between lifting and cardio
  exerciseType: { type: String, enum: ['Strength', 'Cardio'], default: 'Strength' },
  name: { type: String, required: true },
  
  // Strength fields
  sets: { type: Number },
  reps: { type: Number },
  weight: { type: Number, default: 0 },
  
  // Cardio fields
  duration: { type: Number }, // in minutes
  distance: { type: Number }, // in km or miles
  
  notes: { type: String, default: '' }
});

const workoutSchema = new mongoose.Schema({
  // Links this workout to the specific user who created it
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  
  // NEW: The Time Machine anchor
  dateString: { type: String, required: true },
  
  title: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  exercises: [exerciseSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);