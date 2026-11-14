const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true }, 
  muscleGroup: { type: String, required: true }, 
  equipment: { type: String, required: true }, 
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  description: { type: String },
  image: { type: String } // NEW: Image URL field
});

module.exports = mongoose.model('Exercise', exerciseSchema);