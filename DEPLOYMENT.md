# Zone Validation System - Deployment Guide

## Quick Start

### Local Setup
```bash
# Install dependencies
npm install

# Start the server
npm start

# Server runs on http://localhost:3000
```

### API Endpoints (with Examples)

**Report a Noise Zone:**
```bash
curl -X POST http://localhost:3000/api/reports/noise \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "lat": 28.6139,
    "lng": 77.2090,
    "severity": 8,
    "description": "Loud construction work"
  }'
```

**Get Verified Zones:**
```bash
curl http://localhost:3000/api/zones/verified
```

**Get User Reputation:**
```bash
curl http://localhost:3000/api/users/user-123/reputation
```

**Get Admin Stats:**
```bash
curl http://localhost:3000/api/admin/stats
```

## Deployment Checklist

- [x] Express server configured
- [x] CORS enabled for cross-origin requests
- [x] Zone validation logic implemented
- [x] User reputation system active
- [x] GPS clustering (50m geofence)
- [x] Auto-verification at 3+ reports
- [x] Zone auto-expiration (30 days)
- [x] All models created
- [x] Services implemented
- [x] package.json updated

## File Structure

```
├── server.js                          # Main Express server
├── ZoneReporter.js                    # Client SDK
├── package.json                       # Dependencies
├── backend/
│   ├── models/
│   │   ├── NoiseZone.js              # Zone schema
│   │   ├── User.js                   # User schema with reputation
│   │   └── ZoneReport.js             # Individual report tracking
│   └── services/
│       └── zoneValidation.js         # Core validation logic
├── test-zone-validation.js            # Full test suite
└── ZONE_VALIDATION_GUIDE.md          # Complete documentation
```

## How Zone Verification Works

### Flow:
1. **User Reports** a zone with GPS coords + severity
2. **System Searches** nearby zones within 50 meters (geofencing)
3. **New Zone?** → Creates zone with reportCount=1, NOT verified
4. **Existing Zone?** → Increments reportCount, averages severity
5. **3+ Reports?** → ✨ AUTO-VERIFIED ✨
6. **User Reputation** → Tracks accuracy, auto-flags after 3 false reports
7. **Auto-Expiry** → Zones expire after 30 days without reconfirmation

## Key Features

### Consensus Model
- Requires 3 independent confirmations before verification
- Prevents spam and false reports
- Democratic validation

### User Reputation
- Accuracy score: (verified_reports / total_reports) × 100
- Auto-flags users after 3 false reports
- Auto-bans users after 5 false reports
- Reputation weighted in zone averaging

### GPS Clustering
- Reports within 50 meters merged into same zone
- Haversine formula for accurate distance
- Prevents duplicate zones

### Evidence Support
- Photos and audio can be attached
- Speeds verification (if evidence, 2 confirmations enough)
- Increases user trust

### Auto-Expiration
- Zones expire after 30 days
- Keeps data fresh
- Stale reports cleaned automatically

## Environment Variables

```bash
PORT=3000                          # Server port (default: 3000)
NODE_ENV=production               # Set to production for deployment
```

## Monitoring

### Admin Dashboard
```bash
GET /api/admin/stats
```

Returns:
- Total zones
- Verified zones
- Active zones
- Verification rate %
- Average reports per zone

## Testing

Run the full test suite:
```bash
# Start server first
npm start

# In another terminal
node test-zone-validation.js
```

## Production Deployment

### With Heroku:
```bash
git push heroku main
```

### With Azure:
```bash
azd deploy
```

### With PM2:
```bash
npm install -g pm2
pm2 start server.js --name "zone-validation"
pm2 save
```

## Troubleshooting

**Server won't start?**
- Check port 3000 is available
- Verify Express/CORS installed: `npm install`
- Check Node version: `node --version` (v14+ required)

**Zones not being created?**
- Verify GPS coordinates are valid (lat: -90 to 90, lng: -180 to 180)
- Check userId is provided
- Ensure Content-Type header is `application/json`

**Verification not working?**
- Need 3 separate reports at same location
- Reports must be within 50 meters
- Can take multiple API calls to test

## Next Steps

1. **Database**: Replace in-memory storage with MongoDB
2. **Frontend**: Add map UI for zone visualization
3. **Mobile App**: Build native mobile verification
4. **ML Detection**: Auto-detect spam patterns
5. **Real-time**: Add WebSocket for live updates

## Support

For issues or questions, check:
- [ZONE_VALIDATION_GUIDE.md](ZONE_VALIDATION_GUIDE.md) - Full technical docs
- [server.js](server.js) - API implementation
- [backend/services/zoneValidation.js](backend/services/zoneValidation.js) - Core logic
