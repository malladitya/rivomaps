# 🔄 Live Route Recalculation Guide

## Overview
Your Rivo app now includes **dynamic route recalculation** that automatically adjusts the route in real-time as the user moves. The system continuously monitors location changes and recalculates the optimal sensory-friendly path.

---

## ✨ New Features

### 1. **Automatic Route Recalculation**
- Routes recalculate every time you move (respecting performance thresholds)
- Updates every 3 seconds minimum to avoid excessive calculations
- Always avoids noisy/crowded areas based on current position

### 2. **Live Location Tracking**
- Continuous GPS monitoring while navigating
- Displays user location marker with accuracy circle
- Updates directions panel with current distance and time to destination

### 3. **Smart Recalculation Logic**
```
User Moves
    ↓
3+ seconds since last calculation?
    ↓
YES → Calculate new route from current location
      ↓
      Check for obstacles in new path
      ↓
      Update map with new route
      ↓
      Update directions panel
```

---

## 🔧 How to Use

### Enable Live Tracking on Route Plan
```javascript
// Automatically start tracking after planning route
planComfortableRoute(originCoords, destCoords, true);
// Parameters:
//   - originCoords: [longitude, latitude]
//   - destCoords: [longitude, latitude]  
//   - true = enable live tracking
```

### Start Tracking Manually
```javascript
startLiveLocationTracking([destination_lon, destination_lat]);
```

### Stop Tracking
```javascript
stopLiveLocationTracking();
```

---

## 📊 Configuration

### Recalculation Thresholds (in script.js)
```javascript
const liveTracking = {
  recalculationThreshold: 50,        // Recalculate if moved 50 meters
  minRecalculationInterval: 3000     // Wait minimum 3 seconds between recalculations
};
```

**Adjust these values based on your needs:**
- **50 meters**: Good balance between responsiveness and performance
- **3 seconds**: Prevents excessive CPU/battery drain
- Increase thresholds on slower devices, decrease for more responsive tracking

---

## 📍 State Management

### Live Tracking Object
```javascript
liveTracking = {
  active: false,                    // Is tracking currently running?
  watchId: null,                    // Geolocation watch ID (for cleanup)
  currentLocation: null,            // Latest [lon, lat] coordinates
  destination: null,                // Target destination coordinates
  lastRecalculatedAt: 0,            // Timestamp of last recalculation
  recalculationThreshold: 50,       // Min distance to trigger recalc (meters)
  minRecalculationInterval: 3000    // Min time between recalcs (milliseconds)
}
```

---

## 🛣️ What Gets Recalculated

### Route Updates
- ✅ Origin point moves to current user location
- ✅ Destination stays fixed (as planned)
- ✅ Detour waypoints recalculated to avoid obstacles
- ✅ Visual line on map updates in real-time

### Directions Panel Updates
- 📏 Distance to destination (recalculated from new position)
- ⏱️ Estimated travel time (based on current distance)
- 🟢 Noise avoidance status

---

## 🧪 Testing Live Recalculation

### Simulating Movement
Since real GPS movement is slow, you can test with:

1. **Manual coordinates**: Open browser console and run:
```javascript
// Simulate movement step by step
recalculateRouteFromLiveLocation([77.45, 28.67], [77.4316, 28.6384]);
```

2. **Watch console logs** for recalculation messages:
```
🔴 Live location tracking started
📍 Location updated: 28.6692, 77.4538 (±10m)
✅ Route recalculated from live location
📍 Location updated: 28.6700, 77.4540 (±12m)
✅ Route recalculated from live location
```

3. **Check map updates**: Route line should change/shift as "user" moves

---

## 🎯 Performance Optimization

### Why We Throttle Recalculations
- **3-second interval**: Prevents calculating route 60+ times per minute
- **50-meter threshold**: Avoids recalcs for minor GPS jitter
- **Result**: Smooth UX + acceptable battery drain

### Battery Impact
- Live tracking uses continuous GPS: **~10-15% battery/hour**
- Recommend: Show warning after 1 hour of tracking
- Future: Add low-power mode with increased thresholds

---

## 🐛 Troubleshooting

### Live Tracking Not Starting
**Problem**: Permission denied error
**Solution**: 
- Check browser geolocation permissions
- User must grant "Allow" when prompted
- HTTPS required (except localhost)

### Route Not Updating
**Problem**: Recalculation not visible
**Solution**:
- Check console for error messages
- Verify map is initialized: `window.map` exists
- Ensure destination is set: `liveTracking.destination` not null

### Battery Draining Too Fast
**Problem**: GPS consuming too much power
**Solution**:
```javascript
// Increase intervals for less frequent updates
liveTracking.minRecalculationInterval = 5000;  // 5 seconds instead of 3
liveTracking.recalculationThreshold = 100;     // 100m instead of 50m
```

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Actual Azure Maps Routing API integration (vs. waypoint calculation)
- [ ] Real-time traffic consideration
- [ ] Speed-based ETA adjustment
- [ ] Low-power tracking mode
- [ ] Route history/breadcrumb trail
- [ ] Multi-waypoint routes with real roads
- [ ] Firebase sync for cloud-based routes
- [ ] WebSocket push updates for server-sent obstacles

---

## 📋 Quick Reference

```javascript
// Start tracking with destination
startLiveLocationTracking([77.4316, 28.6384]);

// Stop tracking
stopLiveLocationTracking();

// Check if active
if (liveTracking.active) { ... }

// Get current location
console.log(liveTracking.currentLocation);

// Change recalculation frequency
liveTracking.minRecalculationInterval = 2000;  // Update every 2 seconds
```

---

## ✅ Verification Checklist

- [ ] Live tracking starts when "Find comfortable route" clicked
- [ ] Location updates show in console logs
- [ ] Route line changes as simulated user moves
- [ ] Directions panel updates distance/time
- [ ] Stop button disables live tracking
- [ ] No errors in browser console
- [ ] Map doesn't freeze during recalculation
