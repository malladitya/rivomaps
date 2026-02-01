const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
const reports = { 
  noise: [], 
  crowds: [], 
  construction: [],
  zones: [],
  users: {}
};

const { calculateDistance, getZoneStats, VERIFICATION_THRESHOLD, FALSE_REPORT_THRESHOLD, GEOFENCE_RADIUS_METERS } = require('./backend/services/zoneValidation');

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working', timestamp: new Date() });
});

// Get all reports and zones
app.get('/api/reports', (req, res) => {
  console.log('GET /api/reports');
  res.json(reports);
});

// Get verified zones
app.get('/api/zones/verified', (req, res) => {
  console.log('GET /api/zones/verified');
  const verifiedZones = reports.zones
    .filter(z => z.verified && z.isActive)
    .map(z => getZoneStats(z));
  res.json(verifiedZones);
});

// Get all active zones
app.get('/api/zones', (req, res) => {
  console.log('GET /api/zones');
  const now = new Date();
  const activeZones = reports.zones
    .filter(z => z.isActive && z.expiresAt > now)
    .map(z => getZoneStats(z));
  res.json(activeZones);
});

// Report noise
app.post('/api/reports/noise', (req, res) => {
  console.log('POST /api/reports/noise', req.body);
  const { userId, lat, lng, severity, description, photoUrl } = req.body;
  
  if (!userId || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Find nearby zones
  const nearbyZones = reports.zones.filter(z => {
    const distance = calculateDistance(lat, lng, z.coordinates.lat, z.coordinates.lng);
    return distance <= GEOFENCE_RADIUS_METERS && z.zoneType === 'noise' && z.isActive;
  });

  let zone;
  let isNew = false;
  let justVerified = false;

  if (nearbyZones.length === 0) {
    zone = {
      id: Date.now(),
      location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      coordinates: { lat, lng },
      zoneType: 'noise',
      severity: severity || 5,
      description,
      reportedBy: userId,
      photoUrl,
      reportCount: 1,
      verified: false,
      verifiedAt: null,
      averageReporterScore: reports.users[userId]?.reputationScore || 50,
      supportingReports: [userId],
      evidenceAttached: !!photoUrl,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    };
    reports.zones.push(zone);
    isNew = true;
  } else {
    zone = nearbyZones[0];
    zone.reportCount += 1;
    zone.severity = Math.round((zone.severity + (severity || 5)) / 2);
    zone.averageReporterScore = (zone.averageReporterScore + (reports.users[userId]?.reputationScore || 50)) / 2;
    zone.supportingReports.push(userId);
    zone.updatedAt = new Date();

    if (zone.reportCount >= VERIFICATION_THRESHOLD && !zone.verified) {
      zone.verified = true;
      zone.verifiedAt = new Date();
      justVerified = true;
    }
  }

  if (!reports.users[userId]) {
    reports.users[userId] = {
      totalReports: 0,
      verifiedReports: 0,
      flaggedReports: 0,
      status: 'active',
      reputationScore: 50
    };
  }
  reports.users[userId].totalReports += 1;
  reports.users[userId].lastReportDate = new Date();

  const report = {
    ...req.body,
    timestamp: Date.now(),
    id: Date.now(),
    zoneId: zone.id,
    zoneVerified: zone.verified,
    zoneReportCount: zone.reportCount
  };
  reports.noise.push(report);

  res.json({
    report,
    zone: getZoneStats(zone),
    isNew,
    justVerified,
    message: justVerified ? 'Zone verified!' : isNew ? 'New zone created' : 'Report added to zone'
  });
});

// Report crowds
app.post('/api/reports/crowd', (req, res) => {
  console.log('POST /api/reports/crowd');
  const { userId, lat, lng, severity, description, photoUrl } = req.body;
  
  const nearbyZones = reports.zones.filter(z => {
    const distance = calculateDistance(lat, lng, z.coordinates.lat, z.coordinates.lng);
    return distance <= GEOFENCE_RADIUS_METERS && z.zoneType === 'crowds' && z.isActive;
  });

  let zone;
  if (nearbyZones.length === 0) {
    zone = {
      id: Date.now(),
      location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      coordinates: { lat, lng },
      zoneType: 'crowds',
      severity: severity || 5,
      description,
      reportedBy: userId,
      photoUrl,
      reportCount: 1,
      verified: false,
      averageReporterScore: reports.users[userId]?.reputationScore || 50,
      supportingReports: [userId],
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    };
    reports.zones.push(zone);
  } else {
    zone = nearbyZones[0];
    zone.reportCount += 1;
    zone.supportingReports.push(userId);
    if (zone.reportCount >= VERIFICATION_THRESHOLD && !zone.verified) {
      zone.verified = true;
      zone.verifiedAt = new Date();
    }
  }

  const report = { ...req.body, timestamp: Date.now(), id: Date.now() };
  reports.crowds.push(report);
  res.json({ report, zone: getZoneStats(zone) });
});

// Report construction
app.post('/api/reports/construction', (req, res) => {
  console.log('POST /api/reports/construction');
  const { userId, lat, lng, severity, description, photoUrl } = req.body;
  
  const nearbyZones = reports.zones.filter(z => {
    const distance = calculateDistance(lat, lng, z.coordinates.lat, z.coordinates.lng);
    return distance <= GEOFENCE_RADIUS_METERS && z.zoneType === 'construction' && z.isActive;
  });

  let zone;
  if (nearbyZones.length === 0) {
    zone = {
      id: Date.now(),
      location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      coordinates: { lat, lng },
      zoneType: 'construction',
      severity: severity || 5,
      description,
      reportedBy: userId,
      photoUrl,
      reportCount: 1,
      verified: false,
      averageReporterScore: reports.users[userId]?.reputationScore || 50,
      supportingReports: [userId],
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    };
    reports.zones.push(zone);
  } else {
    zone = nearbyZones[0];
    zone.reportCount += 1;
    zone.supportingReports.push(userId);
    if (zone.reportCount >= VERIFICATION_THRESHOLD && !zone.verified) {
      zone.verified = true;
      zone.verifiedAt = new Date();
    }
  }

  const report = { ...req.body, timestamp: Date.now(), id: Date.now() };
  reports.construction.push(report);
  res.json({ report, zone: getZoneStats(zone) });
});

// Get user reputation
app.get('/api/users/:userId/reputation', (req, res) => {
  const user = reports.users[req.params.userId];
  if (!user) {
    return res.json({ reputationScore: 50, status: 'new', message: 'New user' });
  }
  res.json({
    totalReports: user.totalReports,
    verifiedReports: user.verifiedReports,
    flaggedReports: user.flaggedReports,
    reputationScore: user.reputationScore,
    status: user.status,
    accuracy: user.totalReports > 0 ? Math.round((user.verifiedReports / user.totalReports) * 100) : 'N/A'
  });
});

// Flag a zone
app.post('/api/zones/:zoneId/flag', (req, res) => {
  const { reason } = req.body;
  const zone = reports.zones.find(z => z.id == req.params.zoneId);
  
  if (!zone) {
    return res.status(404).json({ error: 'Zone not found' });
  }

  zone.isActive = false;
  zone.flaggedAt = new Date();
  zone.flagReason = reason;

  const reporter = reports.users[zone.reportedBy];
  if (reporter) {
    reporter.flaggedReports += 1;
    if (reporter.flaggedReports >= FALSE_REPORT_THRESHOLD) {
      reporter.status = 'flagged';
    }
  }

  res.json({ message: 'Zone flagged', zone: getZoneStats(zone) });
});

// Admin stats
app.get('/api/admin/stats', (req, res) => {
  const totalZones = reports.zones.length;
  const verifiedZones = reports.zones.filter(z => z.verified).length;
  const activeZones = reports.zones.filter(z => z.isActive).length;
  const totalReports = Object.keys(reports.users).length;
  
  res.json({
    totalZones,
    verifiedZones,
    activeZones,
    totalReports,
    avgReportsPerZone: totalZones > 0 ? (reports.noise.length + reports.crowds.length + reports.construction.length) / totalZones : 0,
    verificationRate: totalZones > 0 ? Math.round((verifiedZones / totalZones) * 100) : 0
  });
});

// Serve static files LAST
app.use(express.static(path.join(__dirname)));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Zone Validation Server running on http://localhost:${PORT}`);
});
