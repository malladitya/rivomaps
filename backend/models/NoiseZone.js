const mongoose = require('mongoose');

const NoiseZoneSchema = new mongoose.Schema({
  location: { type: String, required: true },
  description: { type: String },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NoiseZone', NoiseZoneSchema);
