const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accuracyScore: { type: Number, default: 100, min: 0, max: 100 },
  totalReports: { type: Number, default: 0 },
  verifiedReports: { type: Number, default: 0 },
  flaggedReports: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'flagged', 'banned'], default: 'active' },
  lastReportDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Calculate user reputation score
UserSchema.methods.getReputationScore = function() {
  if (this.totalReports === 0) return 50; // New users start at 50
  return Math.round((this.verifiedReports / this.totalReports) * 100);
};

module.exports = mongoose.model('User', UserSchema);
