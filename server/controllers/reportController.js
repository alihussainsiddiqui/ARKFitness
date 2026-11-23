
const BodyMetric = require('../models/BodyMetric');
const Nutrition = require('../models/Nutrition');
const Workout = require('../models/Workout');
const User = require('../models/User');

// @desc Get complete or weekly fitness performance
// @route GET /api/reports/performance?period=all|weekly
// @access Private

const getPerformanceReport = async (req, res) => {
  try {
    const { period = 'all' } = req.query;

    if (!['all', 'weekly'].includes(period)) {
      return res.status(400).json({
        message: 'Invalid report period'
      });
    }

    const userId = req.user.id;

    // Weekly date range: today + previous 6 days
    const today = new Date();
    const endDate = today.toISOString().slice(0, 10);

    const start = new Date();
    start.setDate(start.getDate() - 6);
    const startDate = start.toISOString().slice(0, 10);

    // Query filters
    const dateFilter = period === 'weekly'
      ? {
          $gte: startDate,
          $lte: endDate
        }
      : null;

    const workoutQuery = { user: userId };
    const nutritionQuery = { user: userId };
    const metricQuery = { user: userId };

    if (dateFilter) {
      workoutQuery.dateString = dateFilter;
      nutritionQuery.dateString = dateFilter;

      metricQuery.date = {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lte: new Date(`${endDate}T23:59:59.999Z`)
      };
    }

    // Fetch all user data
    const [user, bodyMetrics, nutrition, workouts] =
      await Promise.all([
        User.findById(userId).select('username email macroGoals'),
        BodyMetric.find(metricQuery).sort({ date: -1 }),
        Nutrition.find(nutritionQuery).sort({ dateString: -1 }),
        Workout.find(workoutQuery).sort({ dateString: -1 })
      ]);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Nutrition totals for selected period
    const nutritionSummary = nutrition.reduce(
      (total, log) => {
        total.calories += log.dailyTotals.calories || 0;
        total.protein += log.dailyTotals.protein || 0;
        total.carbs += log.dailyTotals.carbs || 0;
        total.fat += log.dailyTotals.fat || 0;
        return total;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Workout summary
    const totalExercises = workouts.reduce(
      (total, workout) => total + workout.exercises.length,
      0
    );

    res.status(200).json({
      success: true,
      period,
      dateRange: period === 'weekly'
        ? { startDate, endDate }
        : null,

      user: {
        username: user.username,
        email: user.email,
        macroGoals: user.macroGoals
      },

      summary: {
        totalBodyMetricRecords: bodyMetrics.length,
        totalNutritionDays: nutrition.length,
        totalWorkouts: workouts.length,
        totalExercises,
        nutrition: nutritionSummary
      },

      bodyMetrics,
      nutrition,
      workouts
    });

  } catch (error) {
    console.error('Performance Report Error:', error);

    res.status(500).json({
      message: 'Unable to generate performance report',
      error: error.message
    });
  }
};

module.exports = { getPerformanceReport };
