
const BodyMetric = require('../models/BodyMetric');

// @desc    Add a new body metric
// @route   POST /api/metrics
// @access  Private
const addMetric = async (req, res) => {
  try {
    const { date, weight, measurements, notes } = req.body;

    if (weight === undefined || weight === null || weight === '') {
      return res.status(400).json({
        message: 'Weight is required'
      });
    }

    const metric = await BodyMetric.create({
      user: req.user.id,
      date,
      weight,
      measurements,
      notes
    });

    res.status(201).json({
      message: 'Body metric added successfully',
      metric
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Get all body metrics of logged-in user
// @route   GET /api/metrics
// @access  Private
const getMetrics = async (req, res) => {
  try {
    const metrics = await BodyMetric.find({
      user: req.user.id
    }).sort({ date: -1 });

    res.status(200).json(metrics);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// @desc    Update a body metric
// @route   PUT /api/metrics/:id
// @access  Private
const updateMetric = async (req, res) => {
  try {
    const metric = await BodyMetric.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!metric) {
      return res.status(404).json({
        message: 'Body metric not found'
      });
    }

    const { date, weight, measurements, notes } = req.body;

    if (date !== undefined) metric.date = date;
    if (weight !== undefined) metric.weight = weight;
    if (measurements !== undefined) {
      metric.measurements = {
        ...metric.measurements.toObject(),
        ...measurements
      };
    }
    if (notes !== undefined) metric.notes = notes;

    const updatedMetric = await metric.save();

    res.status(200).json({
      message: 'Body metric updated successfully',
      metric: updatedMetric
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// @desc    Delete a body metric
// @route   DELETE /api/metrics/:id
// @access  Private
const deleteMetric = async (req, res) => {
  try {
    const metric = await BodyMetric.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!metric) {
      return res.status(404).json({
        message: 'Body metric not found'
      });
    }

    res.status(200).json({
      message: 'Body metric deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
module.exports = {
  addMetric,
  getMetrics,
  updateMetric,
  deleteMetric
};
