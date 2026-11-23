
const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const {
  getPerformanceReport
} = require('../controllers/reportController');

router.get('/performance', protect, getPerformanceReport);

module.exports = router;
