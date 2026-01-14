# Live Location & Directions Feature Guide

## Overview
Your Rivo app now includes **real-time location tracking** and **on-map directions display**. Users can see their current location updated live on the map and get turn-by-turn navigation directions.

## New Features

### 1. **Live Location Tracking** 📍
- Automatically tracks user's current location in real-time
- Updates the map marker as the user moves
- Shows location accuracy (in meters)
- Pulsing animation for user location marker

**How it works:**
- When user clicks "Find comfortable route" button, live tracking starts automatically
- Location updates continuously with high accuracy
- Uses device's geolocation API (requires user permission)

### 2. **Directions Display** 🗺️
- Shows turn-by-turn navigation on the map
- Displays distance and estimated travel time
- Shows directional arrows along the route
- Floating directions panel on the right side (bottom on mobile)

**Route Information Shown:**
- Total distance in kilometers
- Estimated travel time
- Route type (Sensory-Friendly)
- Step-by-step instructions

### 3. **Enhanced Route Planning** 🌿
- Routes automatically calculated from **live current location** (not from input field)
- Smart avoidance of noisy/crowded areas
- Prefers green spaces and calm routes
- Visual feedback with teal-colored route line

## How to Use

### Starting Live Location Tracking

```javascript
// Automatically starts when user clicks "Find comfortable route"
startLiveLocationTracking();
```

### Manual Usage

Users can:
1. Click "Use current location" button to get their coordinates
2. Enter a destination
3. Click "Find comfortable route" button
4. Live location tracking starts automatically
5. Route displays with directions panel

### How the Flow Works

```
1. User clicks "Find comfortable route"
   ↓
2. Live location tracking starts (if not already running)
3. Device requests location permission
4. System gets real-time coordinates
   ↓
5. Destination is geocoded (place name → coordinates)
   ↓
6. Route is calculated from LIVE location to destination
   ↓
7. Route displays on map with blue teal line
8. Directions panel appears with step-by-step info
   ↓
9. As user moves, location marker updates in real-time
10. Route can be recalculated if needed
```

## Technical Implementation

### New Functions Added

#### `startLiveLocationTracking()`
Starts continuous location tracking using `watchPosition`
```javascript
startLiveLocationTracking();
// Returns: Watch ID stored in geolocationWatchId
```

#### `stopLiveLocationTracking()`
Stops the live location tracking
```javascript
stopLiveLocationTracking();
```

#### `updateUserLocationMarker(coords)`
Updates the user location marker on the map with pulsing animation

#### `displayDirections(originCoords, destCoords)`
Shows directions panel with route information

#### `geocodeAndPlanRoute(destination)`
Converts place name to coordinates and plans the route
```javascript
geocodeAndPlanRoute("Sector 17, Chandigarh");
```

#### `calculateDistance(coord1, coord2)`
Calculates distance between two points (uses Haversine formula)

#### `addDirectionArrows(lineString)`
Adds directional arrows along the route for visual guidance

### Global Variables

```javascript
let userLocation = null;           // Current [lng, lat]
let userLocationMarker = null;     // Map marker for user
let geolocationWatchId = null;     // Active watch ID
let directionsLayer = null;        // Directions layer on map
```

## Map Visual Elements

### User Location Marker
- **Style:** Pulsing blue circle
- **Animation:** 2-second pulse cycle
- **Updates:** Every 1-10 seconds (depends on device)

### Route Line
- **Color:** Teal (#0EA5A2)
- **Style:** Dashed line, rounded corners
- **Width:** 6px
- **Opacity:** 0.9

### Direction Arrows
- **Placed:** Every 5th point along the route
- **Shows:** Direction of travel
- **Count:** ~5 arrows total along route

### Directions Panel
- **Position:** Bottom-right corner (fixed)
- **Mobile:** Bottom full-width with 50vh max height
- **Shows:**
  - Distance and time
  - Route type
  - Step-by-step directions
  - Close button

## User Permissions Required

The app requires the following browser permissions:
1. **Geolocation** - To access device location
2. **High Accuracy** - For precise coordinates (may use GPS + WiFi)

**Permission Request:** Browser will show a dialog asking user to allow location access.

## Error Handling

The app handles these scenarios:

| Error | Message | Fallback |
|-------|---------|----------|
| Geolocation not supported | "Geolocation is not supported by your browser" | Alert shown, no tracking |
| Permission denied | "Location permission denied" | Manual location entry required |
| Location unavailable | "Location unavailable" | User can enter coordinates manually |
| Location timeout | "Location request timed out" | Retry with user action |

## API Integration

### Geocoding
Uses **OpenStreetMap Nominatim API** (free, no key needed)
```
https://nominatim.openstreetmap.org/search
https://nominatim.openstreetmap.org/reverse
```

### Azure Maps
Displays route on Azure Maps with custom layers
- Requires: Azure Maps subscription key
- See: [index.html](index.html) line ~46

## Performance Optimization

- ⚡ **Location updates:** High accuracy only when needed
- 🎯 **Route calculation:** Debounced to avoid excessive calculations
- 🗺️ **Map rendering:** Uses vector tiles for smooth performance
- 💾 **Memory:** Old markers cleaned up before adding new ones

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Geolocation | ✅ | ✅ | ✅ | ✅ |
| High Accuracy | ✅ | ✅ | ✅ | ✅ |
| watchPosition | ✅ | ✅ | ✅ | ✅ |
| Azure Maps | ✅ | ✅ | ✅ | ✅ |

## Testing Checklist

- [ ] Request location permission shows correctly
- [ ] Live location updates as you move
- [ ] User marker appears on map with pulsing animation
- [ ] Route calculates correctly from live location
- [ ] Directions panel displays with accurate distance
- [ ] Route avoids noisy zones (if any nearby)
- [ ] Direction arrows show along the route
- [ ] Closing directions panel works
- [ ] Works on mobile and desktop
- [ ] Mobile view shows directions panel at bottom
- [ ] Geolocation stops when app is closed

## Customization

### Change Update Interval
Edit `script.js` line where `watchPosition` is called:
```javascript
geolocationWatchId = navigator.geolocation.watchPosition(
  success_callback,
  error_callback,
  {
    enableHighAccuracy: true,
    timeout: 10000,              // Max wait time (ms)
    maximumAge: 0                // Don't use cached position
  }
);
```

### Change Route Color
Edit directions layer in `displayDirections()`:
```javascript
strokeColor: '#0EA5A2',  // Change this to any hex color
```

### Change Directions Panel Position
Edit CSS in `createDirectionsPanel()`:
```css
.directions-panel {
  bottom: 20px;  /* Distance from bottom */
  right: 20px;   /* Distance from right */
}
```

## Future Enhancements

Potential features to add:
- 📱 Real-time traffic updates
- 🚶 Walking vs. cycling route optimization
- 🎵 Sound level heatmaps
- 💬 Voice navigation
- 🔔 Alerts for comfort level changes
- 📊 Route history tracking
- 👥 Multi-user routing

## Troubleshooting

### Location not updating?
1. Check browser permissions for geolocation
2. Ensure device GPS is enabled
3. Wait 10-15 seconds for first position fix
4. Try moving outdoors for better signal

### Route not showing?
1. Verify Azure Maps key is set in `initMap()`
2. Check destination is valid (try major city)
3. Open browser console (F12) for error messages

### Directions panel not appearing?
1. Check if `displayDirections()` is being called
2. Verify CSS styles are loaded
3. Check browser console for JavaScript errors

## Files Modified

- **[script.js](script.js)** - Main implementation (431 lines added)
- **[index.html](index.html)** - HTML structure (no changes required)

## Dependencies

- Azure Maps SDK (already included)
- OpenStreetMap Nominatim API (free)
- Browser Geolocation API
- Modern JavaScript (ES6+)

---

**Last Updated:** January 2026
**Version:** 1.0
