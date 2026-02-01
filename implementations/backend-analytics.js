// Backend Analytics Logger
// Sends user behavior data to your own server/database

class BackendAnalytics {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.userId = null;
    this.sessionId = this.generateSessionId();
    this.queue = [];
    this.flushInterval = 5000; // Send data every 5 seconds
    this.startAutoFlush();
  }

  generateSessionId() {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  setUserId(userId) {
    this.userId = userId;
  }

  // Add event to queue
  logEvent(eventType, data) {
    const event = {
      eventType,
      data,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      url: window.location.href
    };

    this.queue.push(event);
    console.log('Event logged:', eventType, data);

    // If queue is large, flush immediately
    if (this.queue.length >= 10) {
      this.flush();
    }
  }

  // Send queued events to backend
  async flush() {
    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(`${this.apiEndpoint}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events: eventsToSend
        })
      });

      if (!response.ok) {
        console.error('Failed to send analytics:', response.statusText);
        // Put events back in queue if failed
        this.queue.unshift(...eventsToSend);
      } else {
        console.log(`Sent ${eventsToSend.length} analytics events`);
      }
    } catch (error) {
      console.error('Analytics error:', error);
      // Put events back in queue
      this.queue.unshift(...eventsToSend);
    }
  }

  // Auto-flush queue periodically
  startAutoFlush() {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  // Track specific events
  trackRouteSearch(from, to) {
    this.logEvent('route_search', { from, to });
  }

  trackRouteCalculated(routeData) {
    this.logEvent('route_calculated', routeData);
  }

  trackUserPreference(preference, value) {
    this.logEvent('preference_set', { preference, value });
  }

  trackSensoryReport(type, location, severity, coordinates) {
    this.logEvent('sensory_report', { type, location, severity, coordinates });
  }

  trackFeatureUsage(featureName, details = {}) {
    this.logEvent('feature_used', { feature: featureName, ...details });
  }

  trackError(error, context = {}) {
    this.logEvent('error', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  trackPageView(page) {
    this.logEvent('page_view', { page });
  }

  trackSignIn(method) {
    this.logEvent('sign_in', { method });
  }

  trackSignOut() {
    this.logEvent('sign_out', {});
  }
}

// Initialize (replace with your API endpoint)
window.backendAnalytics = new BackendAnalytics('https://your-api.com/api');
