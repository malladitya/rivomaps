# Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: Location Permission Denied

**Symptoms:**
- "❌ Location permission denied" alert
- Blue location marker not appearing
- No tracking happening

**Solutions:**

1. **Browser Settings:**
   - Chrome: Settings → Privacy → Site settings → Location → Allow
   - Firefox: Preferences → Privacy → Permissions → Location → Allow
   - Safari: System Preferences → Security & Privacy → Location Services
   - Edge: Settings → Privacy → Permissions → Location → Allow

2. **Website Permissions:**
   - Look for location icon in address bar
   - Click it and select "Allow"
   - Refresh the page

3. **System Level:**
   - Windows: Settings → Privacy & Security → Location → Turn ON
   - Mac: System Preferences → Security & Privacy → Location Services → ON
   - Android: Settings → Apps → Permissions → Location → Allow
   - iPhone: Settings → Privacy → Location Services → ON

4. **Browser Cache:**
   - Clear cookies: Ctrl+Shift+Delete (Windows) / Cmd+Shift+Delete (Mac)
   - Clear cache and site data
   - Hard refresh: Ctrl+Shift+R or Cmd+Shift+R

### Issue 2: Location Not Updating

**Symptoms:**
- Location marker appears but doesn't move
- Shows same coordinates after moving
- "±999m" accuracy stays constant

**Solutions:**

1. **Outdoor vs Indoor:**
   - Move to open outdoor area
   - Stand in one place for 30 seconds
   - Wait for GPS to lock on (first fix is usually poor)

2. **Device Settings:**
   - Enable "High Accuracy" mode in phone settings
   - Turn off "Battery Saver" mode
   - Restart GPS by turning flight mode ON then OFF

3. **Wait for Signal:**
   - First GPS fix takes 10-30 seconds
   - In buildings, move to window
   - In dense urban areas, GPS is less accurate

4. **Clear Browser Cache:**
   ```javascript
   // Force fresh location request
   stopLiveLocationTracking();
   startLiveLocationTracking();
   ```

### Issue 3: Route Not Calculating

**Symptoms:**
- Blue teal route line not appearing
- Directions panel not showing
- Map stays unchanged after clicking button

**Solutions:**

1. **Check Browser Console:**
   - Press F12 to open Developer Tools
   - Look for red error messages
   - Send error message to developer

2. **Verify Azure Maps Key:**
   - Open `index.html`
   - Find: `subscriptionKey: 'YOUR_AZURE_MAPS_KEY'`
   - If it says "YOUR_AZURE_MAPS_KEY", replace with real key
   - Get key from Azure Portal

3. **Check Destination:**
   - Make sure destination is valid city/place
   - Try: "Delhi", "Chandigarh", "Mumbai"
   - Avoid very small street names
   - Include city if ambiguous (e.g., "Main St, Delhi")

4. **Internet Connection:**
   - Check if connected to WiFi/4G
   - Try refreshing page
   - Check if Azure Maps URL is not blocked

5. **Browser Compatibility:**
   - Try different browser (Chrome, Firefox, Safari)
   - Update browser to latest version
   - Disable extensions that might block maps

### Issue 4: Directions Panel Not Showing

**Symptoms:**
- Route appears on map but no panel
- Panel appears but empty
- "Close" button not working

**Solutions:**

1. **Force Panel Creation:**
   ```javascript
   // In browser console
   let panel = document.getElementById('directions-panel');
   if (!panel) {
     console.log('Panel will be created on next route');
   } else {
     panel.style.display = 'block';
   }
   ```

2. **Check Map Initialization:**
   - Wait 2-3 seconds for map to load
   - Look for "Azure Maps not needed" message (normal on other pages)
   - Try clicking button again

3. **Mobile Issues:**
   - Panel should slide up from bottom
   - If hidden: scroll down on map
   - Check if viewport is too small

4. **JavaScript Errors:**
   ```javascript
   // Test directions function directly
   displayDirections(
     [77.4538, 28.6692],    // Your location
     [77.4316, 28.6384]     // Destination
   );
   ```

### Issue 5: Poor GPS Accuracy

**Symptoms:**
- Blue marker shows wrong location
- Location jumps around wildly
- Shows ±200m accuracy or worse

**Solutions:**

1. **Better Outdoor Signal:**
   - Move away from buildings
   - Avoid tunnels and overpasses
   - Under trees is worse than open sky
   - Wait 1-2 minutes for signal improvement

2. **Disable Battery Saver:**
   - Windows: Settings → Battery saver → Disable
   - Android: Settings → Battery → Battery saver → OFF
   - iPhone: Settings → Battery → Low Power Mode → OFF

3. **Clear GPS Cache:**
   - Windows Phone: Restart device
   - Android: Settings → Apps → Location → Clear Cache
   - iPhone: Reset location & privacy settings

4. **Use WAAS/DGPS:**
   - Some phones support satellite-based augmentation
   - Usually enabled automatically
   - Can improve accuracy to ±5-10m

### Issue 6: Map Controls Not Working

**Symptoms:**
- Can't zoom/pan map
- 3D button doesn't work
- Center button not responsive

**Solutions:**

1. **Reload Map:**
   ```javascript
   // Reinitialize map
   location.reload();  // Full page refresh
   ```

2. **Check for Map Blocking:**
   - Look for CSS that might cover map
   - Press F12 → Elements → Inspect map
   - Check z-index of overlying elements

3. **Mobile Issues:**
   - Use two-finger pinch to zoom
   - Drag to pan map
   - Double-tap to zoom in

### Issue 7: Destination Geocoding Fails

**Symptoms:**
- "❌ Location not found" error
- Red X icon in directions panel
- Cannot get to any destination

**Solutions:**

1. **Better Destination Names:**
   ```
   ❌ Wrong:  "Main St"
   ✅ Right:  "Main St, Delhi"
   
   ❌ Wrong:  "The Park"
   ✅ Right:  "The Park Hotel, Delhi"
   
   ❌ Wrong:  "Office"
   ✅ Right:  "Office Building, Sector 17, Chandigarh"
   ```

2. **Use Major Landmarks:**
   - "India Gate, Delhi"
   - "Taj Mahal, Agra"
   - "Connaught Place, Delhi"
   - "Lodhi Garden, Delhi"

3. **Check Spellings:**
   - Delhi, not "Dehli"
   - Chandigarh, not "Chandigrah"
   - Mumbai, not "Bombay"

4. **Manual Coordinates:**
   ```javascript
   // If geocoding fails, use coordinates
   const destination = [77.2197, 28.6139];  // [lng, lat]
   planComfortableRoute(userLocation, destination);
   ```

### Issue 8: App Slow/Lagging

**Symptoms:**
- Location updates are slow
- Map pan/zoom is jerky
- High battery drain

**Solutions:**

1. **Reduce Update Frequency:**
   ```javascript
   // In startLiveLocationTracking()
   // Change maximumAge to cache more
   navigator.geolocation.watchPosition(
     callback,
     error,
     {
       enableHighAccuracy: true,
       timeout: 15000,        // Increase from 10000
       maximumAge: 5000       // Use 5-second cached position
     }
   );
   ```

2. **Disable High Accuracy:**
   ```javascript
   enableHighAccuracy: false  // Faster but less accurate
   ```

3. **Close Other Apps:**
   - GPS uses significant battery
   - Close other map/location apps
   - Close browser tabs with maps

4. **Reduce Map Complexity:**
   - Zoom in to reduce tiles loaded
   - Disable heatmap layers if not needed

### Issue 9: Geolocation Not Supported

**Symptoms:**
- "Geolocation is not supported" alert
- Can't use location features
- Location button disabled

**Solutions:**

1. **Use Modern Browser:**
   - All modern browsers support Geolocation
   - Chrome 6+, Firefox 3.5+, Safari 5+, IE 9+
   - Update your browser to latest version

2. **Enable in Browser:**
   - Check if location service is disabled
   - Re-enable in browser settings
   - Remove location from blocked list

3. **Use HTTPS:**
   - Modern browsers require HTTPS for geolocation
   - Local development (localhost) is exception
   - If on HTTP, switch to HTTPS

4. **Disable VPN:**
   - Some VPNs block geolocation
   - Try disabling VPN temporarily
   - Check if issue persists

### Issue 10: Routes Avoid Wrong Areas

**Symptoms:**
- Route shows unnecessary detours
- Avoids perfectly fine streets
- Takes illogical path

**Solutions:**

1. **Check Reported Zones:**
   - Look at red markers on map
   - These are user-reported noisy areas
   - If wrong, report correct area

2. **Report Correct Areas:**
   - Click "Report Noise" or "Report Crowd"
   - Mark truly problematic areas
   - Community improves over time

3. **Adjust Route Algorithm:**
   ```javascript
   // In generateComfortRoute()
   // Reduce avoidance distance
   const distToZone = Math.hypot(...);
   if (distToZone < 0.02) needsDetour = true;  // Increase from 0.01
   ```

---

## Testing Checklist

### Quick Test
- [ ] Open browser console (F12)
- [ ] Click "Use current location"
- [ ] Grant location permission
- [ ] Enter destination: "India Gate, Delhi"
- [ ] Click "Find comfortable route"
- [ ] See teal line on map
- [ ] See directions panel

### Full Test
- [ ] Test on phone
- [ ] Test indoors (accuracy test)
- [ ] Test outdoors (better accuracy)
- [ ] Test in different city
- [ ] Test with various destinations
- [ ] Test on mobile WiFi
- [ ] Test on mobile 4G
- [ ] Test location tracking accuracy
- [ ] Move and see marker update
- [ ] Try multiple routes

---

## Performance Monitoring

### Check Location Accuracy
```javascript
// After location updates
setInterval(() => {
  if (userLocation) {
    console.log('Location:', userLocation);
    // Better accuracy = lower value
    // < 10m = excellent
    // 10-50m = good
    // 50-100m = acceptable
    // > 100m = poor
  }
}, 2000);
```

### Monitor Battery Usage
- Record battery before/after 30 min of tracking
- Should be <5% additional drain
- High Accuracy mode uses more battery

### Check Network Usage
- Geocoding: ~2KB per request
- Route calculation: <1KB
- Map tiles: 100-500KB depending on zoom

---

## Emergency Troubleshooting

### Nuclear Option: Full Reset
```javascript
// Stop tracking
stopLiveLocationTracking();

// Clear map
if (map) map.sources.clear();

// Reload page
location.reload();

// Wait 5 seconds
setTimeout(() => {
  // Try again
  startLiveLocationTracking();
}, 5000);
```

### Check Everything
```javascript
// Run this in console
console.log({
  geolocationSupported: !!navigator.geolocation,
  mapLoaded: !!window.atlas,
  userLocation: userLocation,
  trackingActive: geolocationWatchId !== null,
  mapReady: !!map,
  datasource: !!datasource
});
```

### Debug with Step-by-Step Output
```javascript
// 1. Test geolocation
console.log('1. Geolocation supported:', !!navigator.geolocation);

// 2. Test location retrieval
navigator.geolocation.getCurrentPosition(
  pos => console.log('2. Location OK:', pos.coords),
  err => console.log('2. Location ERROR:', err)
);

// 3. Test Azure Maps
console.log('3. Azure Maps loaded:', !!window.atlas);

// 4. Test map object
setTimeout(() => {
  console.log('4. Map object ready:', !!map);
}, 3000);

// 5. Test geocoding
fetch('https://nominatim.openstreetmap.org/search?format=json&q=Delhi&limit=1')
  .then(r => r.json())
  .then(d => console.log('5. Geocoding OK:', d[0]?.display_name))
  .catch(e => console.log('5. Geocoding ERROR:', e));
```

---

## Getting Help

### Information to Provide

If reporting an issue, include:

1. **Browser & Version:**
   ```javascript
   navigator.userAgent
   ```

2. **Error Message:**
   - Screenshot of error
   - Full text from console

3. **Steps to Reproduce:**
   - Exact sequence of clicks
   - Time of day
   - Location/timezone

4. **System Info:**
   - Desktop, mobile, tablet?
   - Connected via WiFi or 4G?
   - GPS enabled? (mobile)

5. **Console Output:**
   ```
   Press F12 → Console → Copy all messages
   ```

---

## Resources

### Documentation
- [MDN Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Azure Maps Docs](https://learn.microsoft.com/en-us/azure/azure-maps/)
- [Nominatim Docs](https://nominatim.org/release-docs/latest/)

### Tools
- [Browser Compatibility](https://caniuse.com)
- [Map Debugger](https://www.openstreetmap.org)
- [Geolocation Test](https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_geolocation)

---

**Still having issues?** Check the browser console (F12) - it usually has helpful error messages! 🔍
