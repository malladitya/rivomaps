const mongoose = require('mongoose');

const NoiseZoneSchema = new mongoose.Schema({
  location: { type: String, required: true },
  description: { type: String },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  zoneType: { type: String, enum: ['noise', 'crowds', 'construction'], default: 'noise' },
  severity: { type: Number, min: 1, max: 10, default: 5 },
  
  // Verification fields
  reportCount: { type: Number, default: 1 },
  supportingReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ZoneReport' }],
  verified: { type: Boolean, default: false },
  verificationThreshold: { type: Number, default: 3 },
  verifiedAt: { type: Date },
  
  // Evidence
  evidenceAttached: { type: Boolean, default: false },
  photoUrl: { type: String },
  audioUrl: { type: String },
  
  // Reputation
  averageReporterScore: { type: Number, default: 50 },
  
  // Expiration
  expiresAt: { type: Date, default: () => new Date(+new Date() + 30*24*60*60*1000) },
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Check if zone should auto-expire
NoiseZoneSchema.methods.checkExpiration = function() {
  if (new Date() > this.expiresAt) {
    this.isActive = false;
    return true;
  }
  return false;
};

// Auto-verify if threshold met
NoiseZoneSchema.methods.autoVerify = function() {
  if (this.reportCount >= this.verificationThreshold && !this.verified) {
    this.verified = true;
    this.verifiedAt = new Date();
    return true;
  }
  return false;
};

module.exports = mongoose.model('NoiseZone', NoiseZoneSchema);
