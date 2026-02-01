// Google Analytics 4 Integration for Rivo Maps
// Track user behavior, routes, and app usage

class RivoAnalytics {
  constructor(measurementId) {
    this.measurementId = measurementId;
    this.initialized = false;
    this.init();
  }

  init() {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', this.measurementId, {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure'
    });

    this.initialized = true;
    console.log('Rivo Analytics initialized');
  }

  // Track route searches
  trackRouteSearch(fromLocation, toLocation) {
    if (!this.initialized) return;
    
    gtag('event', 'route_search', {
      event_category: 'Navigation',
      event_label: `${fromLocation} to ${toLocation}`,
      from_location: fromLocation,
      to_location: toLocation
    });
  }

  // Track route calculation
  trackRouteCalculated(routeData) {
    if (!this.initialized) return;
    
    gtag('event', 'route_calculated', {
      event_category: 'Navigation',
      distance_km: routeData.distance,
      duration_min: routeData.duration,
      route_type: routeData.type || 'standard'
    });
  }

  // Track user preferences
  trackPreferenceChange(preference, value) {
    if (!this.initialized) return;
    
    gtag('event', 'preference_change', {
      event_category: 'Settings',
      preference_name: preference,
      preference_value: value
    });
  }

  // Track sensory reports (noise, crowd levels)
  trackSensoryReport(reportType, location, severity) {
    if (!this.initialized) return;
    
    gtag('event', 'sensory_report', {
      event_category: 'Community',
      report_type: reportType, // 'noise', 'crowd', 'quiet'
      location: location,
      severity: severity
    });
  }

  // Track route saving
  trackRouteSaved(from, to) {
    if (!this.initialized) return;
    
    gtag('event', 'route_saved', {
      event_category: 'Engagement',
      event_label: `${from} to ${to}`
    });
  }

  // Track favorite places
  trackFavoriteAdded(placeName) {
    if (!this.initialized) return;
    
    gtag('event', 'favorite_added', {
      event_category: 'Engagement',
      place_name: placeName
    });
  }

  // Track sign-ins
  trackSignIn(method) {
    if (!this.initialized) return;
    
    gtag('event', 'login', {
      method: method // 'google', 'email'
    });
  }

  // Track feature usage
  trackFeatureUsed(featureName) {
    if (!this.initialized) return;
    
    gtag('event', 'feature_used', {
      event_category: 'Features',
      feature_name: featureName
    });
  }

  // Track errors
  trackError(errorType, errorMessage) {
    if (!this.initialized) return;
    
    gtag('event', 'exception', {
      description: errorMessage,
      error_type: errorType,
      fatal: false
    });
  }

  // Track page views manually
  trackPageView(pageName) {
    if (!this.initialized) return;
    
    gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href
    });
  }

  // Track custom events
  trackCustomEvent(eventName, params = {}) {
    if (!this.initialized) return;
    
    gtag('event', eventName, params);
  }
}

// Initialize with your Google Analytics 4 Measurement ID
// Analytics dashboard: https://analytics.google.com/
// TODO: Replace 'YOUR-MEASUREMENT-ID' with your actual Google Analytics 4 Measurement ID
// Get it from: https://analytics.google.com/ → Admin → Data Streams → Measurement ID
if (typeof window.rivoAnalytics === 'undefined') {
  window.rivoAnalytics = new RivoAnalytics('G-HB4V1F8S52'); // Replace with YOUR ID
}
