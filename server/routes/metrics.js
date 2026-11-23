
const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  addMetric,
  getMetrics,
  updateMetric,
  deleteMetric
} = require('../controllers/metricsController');


router.route('/')
  .post(protect, addMetric)
  .get(protect, getMetrics);

router.route('/:id')
  .put(protect, updateMetric)
  .delete(protect, deleteMetric);

module.exports = router;
