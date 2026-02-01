// Rivo Analytics Integration Example
// This shows how to track key events in your app

// Example usage throughout your app:

// 1. ROUTE SEARCH - Track when users search for routes
document.getElementById('searchButton')?.addEventListener('click', () => {
  const from = document.getElementById('fromLocation').value;
  const to = document.getElementById('toLocation').value;
  
  if (from && to) {
    window.rivoAnalytics.trackRouteSearch(from, to);
  }
});

// 2. ROUTE CALCULATED - Track when route is successfully calculated
function onRouteCalculated(routeData) {
  window.rivoAnalytics.trackRouteCalculated({
    distance: routeData.distance,
    duration: routeData.duration,
    type: routeData.isQuiet ? 'quiet' : 'standard'
  });
}

// 3. SENSORY REPORT - Track community reports
function submitSensoryReport(type, location, severity) {
  window.rivoAnalytics.trackSensoryReport(type, location, severity);
  // type: 'noise', 'crowd', 'quiet'
  // severity: 'low', 'medium', 'high'
}

// 4. ROUTE SAVED - Track when users save routes
function saveRouteWithAnalytics(from, to) {
  window.rivoStorage.saveRoute({ from, to });
  window.rivoAnalytics.trackRouteSaved(from, to);
}

// 5. FAVORITE ADDED - Track favorite places
function addFavoriteWithAnalytics(placeName) {
  window.rivoStorage.addFavorite({ name: placeName });
  window.rivoAnalytics.trackFavoriteAdded(placeName);
}

// 6. PREFERENCE CHANGE - Track user preferences
function updatePreferenceWithAnalytics(preference, value) {
  window.rivoStorage.savePreferences({ [preference]: value });
  window.rivoAnalytics.trackPreferenceChange(preference, value);
}

// 7. FEATURE USAGE - Track when users use specific features
document.getElementById('voiceNavigationBtn')?.addEventListener('click', () => {
  window.rivoAnalytics.trackFeatureUsed('voice_navigation');
});

document.getElementById('aiChatbot')?.addEventListener('click', () => {
  window.rivoAnalytics.trackFeatureUsed('ai_chatbot');
});

// 8. ERROR TRACKING - Track errors automatically
window.addEventListener('error', (event) => {
  window.rivoAnalytics.trackError('javascript_error', event.message);
});

// 9. PAGE VIEWS - Track page navigation
window.addEventListener('hashchange', () => {
  const page = window.location.hash || '#home';
  window.rivoAnalytics.trackPageView(page);
});

// 10. CUSTOM EVENTS - Track anything else you need
function trackCustomEvent(name, data) {
  window.rivoAnalytics.trackCustomEvent(name, data);
}

// Example: Track when user changes map style
function onMapStyleChange(style) {
  trackCustomEvent('map_style_changed', { style });
}

// Example: Track when user enables accessibility features
function onAccessibilityEnabled(feature) {
  trackCustomEvent('accessibility_enabled', { feature });
}

console.log('Rivo Analytics integration examples loaded');
