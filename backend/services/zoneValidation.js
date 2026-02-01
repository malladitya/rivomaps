/**
 * Zone Validation Service
 * Handles verification, reputation scoring, and zone validation
 */

const VERIFICATION_THRESHOLD = 3;
const FALSE_REPORT_THRESHOLD = 3;
const GEOFENCE_RADIUS_METERS = 50;
const ZONE_EXPIRY_DAYS = 30;

/**
 * Calculate distance between two GPS coordinates (Haversine formula)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearby zones within geofence radius
 */
async function findNearbyZones(lat, lng, zoneType, NoiseZone) {
  const allZones = await NoiseZone.find({ zoneType, isActive: true });
  return allZones.filter(zone => {
    const distance = calculateDistance(
      lat, lng,
      zone.coordinates.lat,
      zone.coordinates.lng
    );
    return distance <= GEOFENCE_RADIUS_METERS;
  });
}

/**
 * Validate and merge a new report into existing zone
 */
async function validateAndMergeReport(reportData, NoiseZone, User) {
  const { lat, lng, zoneType, userId, severity, description, photoUrl } = reportData;

  // Find nearby zones
  const nearbyZones = await findNearbyZones(lat, lng, zoneType, NoiseZone);

  if (nearbyZones.length === 0) {
    // Create new zone
    const user = await User.findById(userId);
    const newZone = new NoiseZone({
      location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      coordinates: { lat, lng },
      zoneType,
      severity,
      description,
      reportedBy: userId,
      photoUrl,
      averageReporterScore: user?.getReputationScore?.() || 50,
      reportCount: 1
    });
    await newZone.save();
    return { zone: newZone, isNew: true, verified: false };
  }

  // Merge with existing zone
  const existingZone = nearbyZones[0];
  existingZone.reportCount += 1;
  existingZone.updatedAt = new Date();
  existingZone.severity = Math.round((existingZone.severity + severity) / 2);

  // Update average reporter score
  const user = await User.findById(userId);
  const userScore = user?.getReputationScore?.() || 50;
  existingZone.averageReporterScore = 
    (existingZone.averageReporterScore + userScore) / 2;

  // Add supporting report
  existingZone.supportingReports.push(userId);

  // Auto-verify if threshold met
  const wasVerified = existingZone.verified;
  existingZone.autoVerify();

  await existingZone.save();

  return {
    zone: existingZone,
    isNew: false,
    verified: existingZone.verified,
    justVerified: !wasVerified && existingZone.verified,
    reportCount: existingZone.reportCount
  };
}

/**
 * Update user reputation based on zone verification
 */
async function updateUserReputation(userId, verified, User) {
  const user = await User.findById(userId);
  if (!user) return;

  user.totalReports += 1;
  if (verified) {
    user.verifiedReports += 1;
  } else {
    user.flaggedReports += 1;
    if (user.flaggedReports >= FALSE_REPORT_THRESHOLD) {
      user.status = 'flagged';
    }
    if (user.flaggedReports >= FALSE_REPORT_THRESHOLD + 2) {
      user.status = 'banned';
    }
  }
  user.lastReportDate = new Date();
  await user.save();
}

/**
 * Flag a zone as having suspicious activity
 */
async function flagZone(zoneId, reason, NoiseZone, User) {
  const zone = await NoiseZone.findById(zoneId);
  if (!zone) return null;

  zone.isActive = false;
  zone.updatedAt = new Date();
  await zone.save();

  // Flag the original reporter
  const originalReporter = await User.findById(zone.reportedBy);
  if (originalReporter) {
    originalReporter.flaggedReports += 1;
    if (originalReporter.flaggedReports >= FALSE_REPORT_THRESHOLD) {
      originalReporter.status = 'flagged';
    }
    await originalReporter.save();
  }

  return zone;
}

/**
 * Get zone statistics for display
 */
function getZoneStats(zone) {
  return {
    id: zone._id,
    location: zone.location,
    coordinates: zone.coordinates,
    zoneType: zone.zoneType,
    severity: zone.severity,
    reportCount: zone.reportCount,
    verified: zone.verified,
    verifiedAt: zone.verifiedAt,
    averageReporterScore: Math.round(zone.averageReporterScore),
    evidenceAttached: zone.evidenceAttached,
    daysUntilExpiry: Math.ceil((zone.expiresAt - new Date()) / (24 * 60 * 60 * 1000)),
    isActive: zone.isActive
  };
}

/**
 * Clean up expired zones
 */
async function cleanupExpiredZones(NoiseZone) {
  const now = new Date();
  const result = await NoiseZone.updateMany(
    { expiresAt: { $lt: now } },
    { isActive: false }
  );
  return result.modifiedCount;
}

module.exports = {
  calculateDistance,
  findNearbyZones,
  validateAndMergeReport,
  updateUserReputation,
  flagZone,
  getZoneStats,
  cleanupExpiredZones,
  VERIFICATION_THRESHOLD,
  FALSE_REPORT_THRESHOLD,
  GEOFENCE_RADIUS_METERS,
  ZONE_EXPIRY_DAYS
};
