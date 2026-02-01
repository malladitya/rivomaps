/**
 * AI Action Handler - Processes AI-generated actions and updates the map/app
 * Integrates AI Understanding output with the rest of the application
 */

window.handleAIAction = function(aiResponse) {
  const { action, data, preferences } = aiResponse;
  
  console.log('Handling AI Action:', action, data);
  
  switch (action) {
    case 'SET_ORIGIN':
      if (data.location) {
        handleSetOrigin(data.location);
      }
      break;
      
    case 'SET_DESTINATION':
      if (data.location) {
        handleSetDestination(data.location);
      }
      break;
      
    case 'CALCULATE_ROUTE':
      if (data.origin && data.destination) {
        handleCalculateRoute(data);
      }
      break;
      
    case 'START_NAVIGATION':
      if (data.destination) {
        handleStartNavigation(data.destination);
      }
      break;
      
    case 'CHECK_COMFORT':
      handleCheckComfort(data);
      break;
      
    case 'ADD_AVOID_AREA':
      if (data.area) {
        handleAvoidArea(data.area);
      }
      break;
      
    case 'SET_PREFERENCE':
      handleSetPreference(data.preference);
      break;
      
    case 'SHOW_HELP':
      // Help message is already displayed
      break;
      
    case 'SHOW_REPORT_GUIDE':
      // Scroll to report zone section
      const reportSection = document.getElementById('report-zone');
      if (reportSection) {
        reportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      break;
      
    case 'SHOW_VISION':
      // Vision message is already displayed
      break;
      
    default:
      console.log('Unknown action:', action);
  }
  
  // Update global state if available
  if (window.aiState) {
    window.aiState = {
      ...window.aiState,
      lastResponse: aiResponse,
      userPreferences: preferences
    };
  } else {
    window.aiState = {
      lastResponse: aiResponse,
      userPreferences: preferences
    };
  }
};

/**
 * Set origin location on the map
 */
function handleSetOrigin(location) {
  console.log('Setting origin:', location);
  // Helper to add marker after geocoding
  function addOriginMarker(lat, lng) {
    if (!window.navigationState) window.navigationState = {};
    window.navigationState.origin = { lat, lng };
    // Add marker to map via Azure Maps
    if (typeof window.map !== 'undefined' && window.map && typeof window.datasource !== 'undefined') {
      const originFeature = new atlas.data.Feature(new atlas.data.Point([lng, lat]), { 
        name: 'Origin', 
        isOrigin: true 
      });
      window.datasource.add(originFeature);
      console.log('✅ Origin marker added to map at:', lat, lng);
    }
    // Leaflet (rivo.html) support
    try {
      if (typeof L !== 'undefined' && typeof map !== 'undefined' && map) {
        if (typeof startCoords !== 'undefined') {
          startCoords = [lng, lat];
        }
        if (typeof startMarker !== 'undefined' && startMarker) {
          startMarker.setLatLng([lat, lng]);
        }
      }
    } catch (error) {
      console.warn('Leaflet origin update failed:', error);
    }
    console.log('✅ Origin set:', { lat, lng });
  }

  // If already coordinates
  if (location && typeof location === 'object' && ('lat' in location) && ('lng' in location)) {
    addOriginMarker(location.lat, location.lng);
    return;
  }
  // If array [lng, lat]
  if (Array.isArray(location) && location.length === 2 && typeof location[0] === 'number' && typeof location[1] === 'number') {
    addOriginMarker(location[1], location[0]);
    return;
  }
  // If string, geocode
  if (typeof location === 'string') {
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`)
      .then(res => res.json())
      .then(results => {
        if (results && results[0]) {
          addOriginMarker(parseFloat(results[0].lat), parseFloat(results[0].lon));
        } else {
          alert('Could not find location: ' + location);
        }
      })
      .catch(() => alert('Geocoding failed for: ' + location));
    return;
  }
  alert('Invalid origin location');
}

/**
 * Set destination location on the map
 */
function handleSetDestination(location) {
  console.log('Setting destination:', location);
  function addDestinationMarker(lat, lng) {
    if (!window.navigationState) window.navigationState = {};
    window.navigationState.destination = { lat, lng };
    // Add destination marker to Azure Maps
    if (typeof window.map !== 'undefined' && window.map && typeof window.datasource !== 'undefined') {
      const destFeature = new atlas.data.Feature(new atlas.data.Point([lng, lat]), { 
        name: 'Destination', 
        isDestination: true 
      });
      window.datasource.add(destFeature);
      console.log('✅ Destination marker added to map at:', lat, lng);
    }
    // Leaflet (rivo.html) support
    try {
      if (typeof L !== 'undefined' && typeof map !== 'undefined' && map) {
        if (typeof endCoords !== 'undefined') {
          endCoords = [lng, lat];
        }
        if (typeof endMarker !== 'undefined' && endMarker) {
          endMarker.setLatLng([lat, lng]);
        }
      }
    } catch (error) {
      console.warn('Leaflet destination update failed:', error);
    }
    console.log('✅ Destination set:', { lat, lng });
  }

  // If already coordinates
  if (location && typeof location === 'object' && ('lat' in location) && ('lng' in location)) {
    addDestinationMarker(location.lat, location.lng);
    return;
  }
  // If array [lng, lat]
  if (Array.isArray(location) && location.length === 2 && typeof location[0] === 'number' && typeof location[1] === 'number') {
    addDestinationMarker(location[1], location[0]);
    return;
  }
  // If string, geocode
  if (typeof location === 'string') {
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`)
      .then(res => res.json())
      .then(results => {
        if (results && results[0]) {
          addDestinationMarker(parseFloat(results[0].lat), parseFloat(results[0].lon));
        } else {
          alert('Could not find location: ' + location);
        }
      })
      .catch(() => alert('Geocoding failed for: ' + location));
    return;
  }
  alert('Invalid destination location');
}

/**
 * Calculate and display route
 */
function handleCalculateRoute(data) {
  console.log('Calculating route:', data);
  
  // Track AI-initiated route calculation
  if (window.rivoAnalytics) {
    window.rivoAnalytics.trackFeatureUsed('ai_route_calculation');
  }
  
  const { origin, destination } = data;
  // Convert to [lng, lat] arrays if needed
  let originCoords = [origin.lng || origin[0], origin.lat || origin[1]];
  let destCoords = [destination.lng || destination[0], destination.lat || destination[1]];
  // Set global startCoords/endCoords for Leaflet logic
  if (typeof window.startCoords !== 'undefined') window.startCoords = originCoords;
  if (typeof window.endCoords !== 'undefined') window.endCoords = destCoords;
  // Move markers if present
  if (typeof window.startMarker !== 'undefined' && window.startMarker) {
    window.startMarker.setLatLng([originCoords[1], originCoords[0]]);
  }
  if (typeof window.endMarker !== 'undefined' && window.endMarker) {
    window.endMarker.setLatLng([destCoords[1], destCoords[0]]);
  }
  // Call Leaflet route function
  if (typeof window.calculateAndDisplayRoute === 'function') {
    window.calculateAndDisplayRoute(false);
    console.log('🛣️ Route displayed on Leaflet/OSM map');
  } else {
    console.warn('Leaflet route function not found.');
  }
}


/**
 * Start turn-by-turn navigation
 */
function handleStartNavigation(destination) {
  console.log('Starting navigation:', destination);
  
  if (!window.navigationState) window.navigationState = {};
  window.navigationState.isNavigating = true;
  
  // Get current location
  const origin = window.navigationState.origin || window.navigationState.currentLocation;
  
  if (!origin) {
    console.error('Origin not set - cannot start navigation');
    return;
  }
  
  const originCoords = [origin.lng || origin[0], origin.lat || origin[1]];
  const destCoords = [destination.lng || destination[0], destination.lat || destination[1]];
  
  // Trigger navigation with live tracking
  if (typeof window.planComfortableRoute === 'function') {
    window.planComfortableRoute(originCoords, destCoords, true); // true = enable live tracking
    console.log('🚀 Navigation started with live tracking');
  }
}

/**
 * Check comfort level at current location
 */
function handleCheckComfort(data) {
  console.log('Checking comfort level:', data);
  
  // Trigger comfort check if function exists
  if (typeof checkComfortLevel === 'function') {
    checkComfortLevel();
  }
}

/**
 * Add area to avoid list
 */
function handleAvoidArea(area) {
  console.log('Adding area to avoid:', area);
  
  if (!window.navigationState) window.navigationState = {};
  if (!window.navigationState.avoidAreas) window.navigationState.avoidAreas = [];
  
  window.navigationState.avoidAreas.push(area);
  
  // Update map if function exists
  if (typeof updateAvoidAreas === 'function') {
    updateAvoidAreas(window.navigationState.avoidAreas);
  }
  
  console.log('🚫 Area added to avoid list');
}

/**
 * Set user preference (comfort/speed)
 */
function handleSetPreference(preference) {
  console.log('Setting preference:', preference);
  
  if (!window.navigationState) window.navigationState = {};
  window.navigationState.preference = preference;
  
  console.log(`⚙️ Preference set to: ${preference}`);
}

/**
 * Get AI engine instance
 */
window.getAIEngine = function() {
  if (typeof AIUnderstandingEngine !== 'undefined') {
    // Create or return existing instance
    if (!window.aiEngineInstance) {
      window.aiEngineInstance = new AIUnderstandingEngine(window.CONFIG?.geminiApiKey);
    }
    return window.aiEngineInstance;
  }
  return null;
};

/**
 * Get conversation summary
 */
window.getConversationSummary = function() {
  const engine = window.getAIEngine();
  if (engine) {
    return engine.getConversationSummary();
  }
  return null;
};

/**
 * Clear AI conversation history
 */
window.clearConversationHistory = function() {
  const engine = window.getAIEngine();
  if (engine) {
    engine.clearHistory();
    console.log('Conversation history cleared');
  }
};

/**
 * Get current navigation state
 */
window.getNavigationState = function() {
  return window.navigationState || {};
};

/**
 * Set navigation state programmatically
 */
window.setNavigationState = function(state) {
  window.navigationState = { ...window.navigationState, ...state };
  console.log('Navigation state updated:', window.navigationState);
};

// Log when loaded
console.log('✅ AI Action Handler loaded - AI-Powered Understanding is ACTIVE');

// Initialize AI-Map Integration
document.addEventListener('DOMContentLoaded', function() {
  // Wait for map to be ready
  const checkMapReady = setInterval(function() {
    if (typeof window.map !== 'undefined' && window.map && typeof window.datasource !== 'undefined') {
      clearInterval(checkMapReady);
      console.log('✅ Map detected - AI integration ready for route display');
      window.aiMapReady = true;
    }
  }, 500);
  
  // Timeout after 10 seconds
  setTimeout(() => {
    if (checkMapReady) clearInterval(checkMapReady);
  }, 10000);
});
