
const mongoose = require('mongoose');

const bodyMetricSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    weight: {
      type: Number,
      required: true,
      min: 0
    },
    measurements: {
      chest: { type: Number, default: 0 },
      waist: { type: Number, default: 0 },
      hips: { type: Number, default: 0 },
      arms: { type: Number, default: 0 },
      thighs: { type: Number, default: 0 }
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BodyMetric', bodyMetricSchema);
