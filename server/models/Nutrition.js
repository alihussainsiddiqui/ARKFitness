const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
});

const nutritionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateString: { type: String, required: true }, // Format: "YYYY-MM-DD" for easy querying
  meals: {
    breakfast: [foodItemSchema],
    lunch: [foodItemSchema],
    dinner: [foodItemSchema],
    snacks: [foodItemSchema],
  },
  dailyTotals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  }
}, { timestamps: true });

// Auto-calculate macros before saving
nutritionSchema.pre('save', function() {
  let cals = 0, pro = 0, car = 0, f = 0;
  
  ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
    this.meals[meal].forEach(item => {
      cals += item.calories;
      pro += item.protein;
      car += item.carbs;
      f += item.fat;
    });
  });

  this.dailyTotals = { calories: cals, protein: pro, carbs: car, fat: f };
});

module.exports = mongoose.model('Nutrition', nutritionSchema);