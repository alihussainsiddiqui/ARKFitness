const express = require('express');
const router = express.Router();
const { getDailyLog, addFoodItem, deleteFoodItem, updateMacroGoals } = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware'); 

// Nutrition Log Routes
router.get('/:dateString', protect, getDailyLog);
router.post('/add', protect, addFoodItem);
router.delete('/:dateString/:mealType/:itemId', protect, deleteFoodItem);

// Macro Goals Route
router.put('/goals', protect, updateMacroGoals);

module.exports = router;