const Nutrition = require('../models/Nutrition');
const User = require('../models/User');

// Helper to do the math before saving to DB
const calculateTotals = (meals) => {
  let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
    meals[meal].forEach(item => {
      totals.calories += item.calories;
      totals.protein += item.protein;
      totals.carbs += item.carbs;
      totals.fat += item.fat;
    });
  });
  return totals;
};

// @route   GET /api/nutrition/:dateString
exports.getDailyLog = async (req, res) => {
  try {
    const { dateString } = req.params;
    let dailyLog = await Nutrition.findOne({ user: req.user.id, dateString });

    if (!dailyLog) {
      dailyLog = {
        dateString,
        dailyTotals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] }
      };
    }
    res.status(200).json(dailyLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/nutrition/add
exports.addFoodItem = async (req, res) => {
  try {
    const { dateString, mealType, foodItem } = req.body; 
    let dailyLog = await Nutrition.findOne({ user: req.user.id, dateString });

    if (!dailyLog) {
      dailyLog = new Nutrition({
        user: req.user.id,
        dateString,
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] }
      });
    }

    // Add the item
    dailyLog.meals[mealType].push(foodItem);
    
    // Update the math
    dailyLog.dailyTotals = calculateTotals(dailyLog.meals);
    
    // FIX: Force Mongoose to acknowledge the nested array was changed
    dailyLog.markModified('meals');
    
    await dailyLog.save();
    res.status(200).json(dailyLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE /api/nutrition/:dateString/:mealType/:itemId
exports.deleteFoodItem = async (req, res) => {
  try {
    const { dateString, mealType, itemId } = req.params;
    let dailyLog = await Nutrition.findOne({ user: req.user.id, dateString });

    if (!dailyLog) return res.status(404).json({ message: 'Log not found' });

    // Remove the item
    dailyLog.meals[mealType] = dailyLog.meals[mealType].filter(
      item => item._id.toString() !== itemId
    );

    // Update the math
    dailyLog.dailyTotals = calculateTotals(dailyLog.meals);
    
    // FIX: Force Mongoose to acknowledge the nested array was changed
    dailyLog.markModified('meals');

    await dailyLog.save();
    res.status(200).json(dailyLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/nutrition/goals
exports.updateMacroGoals = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { macroGoals: req.body } },
      { returnDocument: 'after' } 
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};