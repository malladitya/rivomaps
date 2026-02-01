# Zone Validation & Verification System

## Overview
This system proves user-reported zones are correct through multi-layered validation mechanisms, perfect for explaining to hackathon judges.

## Key Features

### 1. **Consensus Verification Model**
- Zones are **auto-verified** after 3+ independent users report the same location
- Each confirmation strengthens the zone's credibility
- Threshold: `VERIFICATION_THRESHOLD = 3`

### 2. **GPS Clustering (Geofencing)**
- Reports within **50 meters** are grouped together
- Prevents duplicate zone creation
- Uses Haversine formula for accurate distance calculation
- `GEOFENCE_RADIUS_METERS = 50`

### 3. **User Reputation System**
- Each user has an `accuracyScore` (0-100%)
- Tracked metrics:
  - `totalReports` - Total reports submitted
  - `verifiedReports` - Reports that led to verified zones
  - `flaggedReports` - Suspicious or false reports
  - `status` - 'active', 'flagged', or 'banned'

**Reputation Calculation:**
```
accuracyScore = (verifiedReports / totalReports) × 100
```

- Users are automatically **flagged** after 3 false reports
- Users are **banned** after 5 false reports

### 4. **Evidence Collection**
- Users can attach:
  - 📸 Photos (photoUrl)
  - 🎙️ Audio clips (audioUrl)
- Zones with evidence:
  - Verify faster (2 confirmations instead of 3)
  - Receive higher priority
  - Flag: `evidenceAttached: true`

### 5. **Severity Scoring**
- Range: 1-10
- Averaged across all reports
- Helps prioritize zones on UI
- Helps judges understand severity

### 6. **Automatic Expiration**
- Zones expire after **30 days** without reconfirmation
- `expiresAt` auto-set on creation
- Ensures data freshness
- `ZONE_EXPIRY_DAYS = 30`
- Flag: `isActive: false` when expired

### 7. **Temporal Patterns**
- System tracks report timestamps
- Construction noise patterns (e.g., 8am-5pm daily)
- Weekend vs. weekday variations
- Helps validate real-world conditions

## Data Models

### NoiseZone Schema
```javascript
{
  location: String,              // "28.6139, 77.2090"
  coordinates: { lat, lng },     // GPS coordinates
  zoneType: 'noise'|'crowds'|'construction',
  severity: Number,              // 1-10
  reportCount: Number,           // How many confirmations
  verified: Boolean,             // Auto-set after 3 reports
  verifiedAt: Date,              // When it became verified
  averageReporterScore: Number,  // Avg credibility of reporters
  photoUrl: String,              // Evidence
  audioUrl: String,              // Evidence
  evidenceAttached: Boolean,
  supportingReports: [userId],   // All reporters
  expiresAt: Date,               // Auto-expires
  isActive: Boolean              // False if expired/flagged
}
```

### User Schema
```javascript
{
  name: String,
  email: String,
  accuracyScore: Number,         // 0-100%
  totalReports: Number,
  verifiedReports: Number,
  flaggedReports: Number,
  status: 'active'|'flagged'|'banned',
  lastReportDate: Date
}
```

### ZoneReport Schema
```javascript
{
  zone: ObjectId,                // Reference to zone
  reportedBy: ObjectId,          // Reporter's user ID
  severity: Number,
  coordinates: { lat, lng },
  photoUrl: String,
  audioUrl: String,
  timestamp: Date,
  verified: Boolean
}
```

## API Endpoints

### Report Zones
```
POST /api/reports/noise
POST /api/reports/crowd
POST /api/reports/construction
```

**Request:**
```json
{
  "userId": "user123",
  "lat": 28.6139,
  "lng": 77.2090,
  "severity": 7,
  "description": "Construction noise at building site",
  "photoUrl": "https://..."
}
```

**Response:**
```json
{
  "report": { /* report details */ },
  "zone": { /* zone details with stats */ },
  "isNew": false,
  "justVerified": true,
  "message": "Zone verified!"
}
```

### Get Verified Zones
```
GET /api/zones/verified
```
Returns only verified and active zones.

### Get Active Zones
```
GET /api/zones
```
Returns all active (non-expired) zones.

### Get User Reputation
```
GET /api/users/{userId}/reputation
```

**Response:**
```json
{
  "totalReports": 10,
  "verifiedReports": 9,
  "flaggedReports": 1,
  "reputationScore": 90,
  "status": "active",
  "accuracy": "90%"
}
```

### Flag a Zone
```
POST /api/zones/{zoneId}/flag
```

**Request:**
```json
{
  "reason": "Duplicate report / Spam / Outdated"
}
```

### Admin Statistics
```
GET /api/admin/stats
```

**Response:**
```json
{
  "totalZones": 150,
  "verifiedZones": 128,
  "activeZones": 140,
  "totalReports": 450,
  "avgReportsPerZone": 3,
  "verificationRate": 85
}
```

## Client Usage

### JavaScript Example
```javascript
// Initialize
const reporter = new ZoneReporter('user-id-123');

// Report a zone
const result = await reporter.reportZone('noise', 28.6139, 77.2090, {
  severity: 8,
  description: 'Loud construction work',
  photoUrl: 'blob:...'
});

console.log(result.zone);        // Zone details
console.log(result.justVerified); // Was this the verifying report?

// Get user reputation
const reputation = await reporter.getReputation();
console.log(reputation.reputationScore);

// Get nearby zones
const nearby = await reporter.findNearbyZones(28.6139, 77.2090, 500);

// Get verified zones
const verified = await reporter.getVerifiedZones();
```

## Validation Flow

### New Report
```
1. User submits report with GPS coordinates
   ↓
2. System validates coordinates (±latitude 90, ±longitude 180)
   ↓
3. Search for nearby zones within 50m radius
   ↓
4. IF no nearby zone:
      Create new zone with reportCount = 1
   ELSE:
      Merge with existing zone, increment reportCount
   ↓
5. Calculate average reporter credibility
   ↓
6. IF reportCount >= 3:
      Set verified = true, verifiedAt = now
   ↓
7. Update user reputation stats
   ↓
8. Return response with zone status
```

## How to Present to Judges

### Key Talking Points

1. **"We use Geofencing"**
   - GPS clustering within 50 meters prevents duplicates
   - Reduces spam and fraud

2. **"Consensus Model"**
   - Requires 3 independent confirmations
   - No single user can create verified zone
   - Democratic approach

3. **"User Reputation"**
   - Track accuracy of each reporter
   - Bad actors are automatically flagged/banned
   - Good reporters are weighted higher

4. **"Evidence-Based"**
   - Users can attach photos and audio
   - Speeds up verification (2 instead of 3 needed)
   - Transparent proof

5. **"Auto-Expiration"**
   - Zones automatically expire after 30 days
   - Prevents stale data
   - Keeps map fresh and accurate

6. **"Real-Time Statistics"**
   - Show verification rate (85% verified)
   - Average reports per zone (3x)
   - Admin can monitor system health

## Testing Checklist

- [ ] Single report creates new zone
- [ ] 2nd report to same location increments reportCount
- [ ] 3rd report auto-verifies zone
- [ ] User reputation tracked correctly
- [ ] Zones expire after 30 days
- [ ] False reporters flagged after 3 reports
- [ ] Geofencing prevents duplicates within 50m
- [ ] Admin stats update correctly
- [ ] Evidence attached speeds verification
- [ ] Zone severity properly averaged

## Future Enhancements

1. **Crowd-Sourced Photos**: Show evidence on map
2. **Real-time Updates**: WebSocket for live zone changes
3. **ML Detection**: Detect spam patterns automatically
4. **API Integration**: Cross-reference with:
   - Google Places (crowds)
   - Local authority permits (construction)
   - Weather services (noise patterns)
5. **Mobile App**: Native verification UI
6. **Admin Dashboard**: Real-time monitoring and manual review
