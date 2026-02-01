// Simple Webhook Logger
// Sends important events to a webhook (Discord, Slack, or custom endpoint)

class WebhookLogger {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  // Send data to webhook
  async send(eventType, data) {
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          eventType: eventType,
          data: data,
          url: window.location.href,
          userAgent: navigator.userAgent.substring(0, 100)
        })
      });
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }

  // Track critical events
  trackNewUser(email) {
    this.send('new_user', { email });
  }

  trackRouteCreated(from, to) {
    this.send('route_created', { from, to });
  }

  trackSensoryReport(type, location, severity) {
    this.send('sensory_report', { type, location, severity });
  }

  trackError(error) {
    this.send('error', { 
      message: error.message,
      stack: error.stack?.substring(0, 500)
    });
  }
}

// Example: Discord Webhook
// Get webhook URL from Discord: Server Settings -> Integrations -> Webhooks
// const webhookLogger = new WebhookLogger('https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN');

// Example: Slack Webhook
// Get from: https://api.slack.com/messaging/webhooks
// const webhookLogger = new WebhookLogger('https://hooks.slack.com/services/YOUR/WEBHOOK/URL');

window.webhookLogger = null; // Initialize when you have webhook URL
