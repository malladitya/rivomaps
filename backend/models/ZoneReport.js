const mongoose = require('mongoose');

const ZoneReportSchema = new mongoose.Schema({
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'NoiseZone', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  zoneType: { type: String, enum: ['noise', 'crowds', 'construction'] },
  severity: { type: Number, min: 1, max: 10 },
  description: { type: String },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  photoUrl: { type: String },
  audioUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
  flagged: { type: Boolean, default: false },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('ZoneReport', ZoneReportSchema);
