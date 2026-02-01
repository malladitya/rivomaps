# Analytics Setup Guide for Rivo Maps

As a developer, you want to collect user data to improve your app. Here's how to set it up:

---

## 🎯 Recommended Approach: Google Analytics 4

**Best for:** Understanding user behavior, popular routes, feature usage

### Setup Steps:

1. **Create Google Analytics Account**
   - Go to: https://analytics.google.com/
   - Click "Start measuring"
   - Create an account and property
   - Choose "Web" platform
   - Get your **Measurement ID** (format: G-XXXXXXXXXX)

2. **Add to Your App**

In `index.html`, add before `</head>`:

```html
<!-- Google Analytics -->
<script src="analytics-setup.js"></script>
<script>
  // Replace with your Measurement ID
  window.rivoAnalytics = new RivoAnalytics('G-XXXXXXXXXX');
</script>
```

3. **Track Events**

```javascript
// When user searches for a route
rivoAnalytics.trackRouteSearch('Chandigarh', 'Delhi');

// When route is calculated
rivoAnalytics.trackRouteCalculated({
  distance: 250,
  duration: 240,
  type: 'quiet'
});

// When user reports noise
rivoAnalytics.trackSensoryReport('noise', 'Main Street', 'high');

// Track feature usage
rivoAnalytics.trackFeatureUsed('voice_navigation');
```

4. **View Data**
   - Go to Google Analytics dashboard
   - See real-time users, popular routes, user flow
   - Export data for analysis

---

## 📊 What Data You'll Get:

### From Google Analytics (Free):
- ✅ User count (daily/monthly active users)
- ✅ Page views and navigation flow
- ✅ Popular routes (most searched origin/destinations)
- ✅ Feature usage statistics
- ✅ User demographics and locations
- ✅ Session duration and engagement
- ✅ Device types (mobile/desktop)
- ✅ Browser and OS data

### Custom Events You Can Track:
- Route searches (from/to)
- Route calculations (distance, duration)
- Sensory reports (noise/crowd/quiet areas)
- Saved routes
- Favorite places
- User preferences
- Sign-ins/sign-ups
- Feature usage
- Errors and issues

---

## 🔧 Alternative: Your Own Backend

If you want full control, set up your own analytics backend:

### Option A: Simple Node.js Server

```javascript
// server.js
app.post('/api/analytics', (req, res) => {
  const { events } = req.body;
  
  // Store in database or log file
  events.forEach(event => {
    console.log('Analytics Event:', event);
    // Save to MongoDB, PostgreSQL, etc.
  });
  
  res.json({ success: true });
});
```

Then use `backend-analytics.js`:

```html
<script src="backend-analytics.js"></script>
<script>
  const analytics = new BackendAnalytics('https://your-server.com/api');
  analytics.trackRouteSearch('A', 'B');
</script>
```

### Option B: Free Services

1. **PostHog** (Free tier: 1M events/month)
   - https://posthog.com/
   - Open source, self-hostable
   - Great analytics dashboard

2. **Mixpanel** (Free tier: 100k events/month)
   - https://mixpanel.com/
   - Advanced user analytics

3. **Plausible** (€9/month, privacy-focused)
   - https://plausible.io/
   - GDPR compliant, no cookies

---

## 🎣 Quick Win: Discord/Slack Webhooks

Get notified of important events instantly:

```javascript
// Setup webhook logger
const logger = new WebhookLogger('YOUR_DISCORD_WEBHOOK_URL');

// Track critical events
logger.trackNewUser('user@example.com');
logger.trackSensoryReport('noise', 'Downtown', 'high');
logger.trackError(new Error('API failed'));
```

**Discord Webhook Setup:**
1. Go to Server Settings → Integrations → Webhooks
2. Create webhook, copy URL
3. Paste in code above

---

## 🔐 Privacy & GDPR

**Important:** Always inform users about data collection!

Add to your privacy policy:
- What data you collect
- How it's used (app improvement)
- How long it's stored
- Users' rights to deletion

Add consent banner:
```html
<div id="cookie-consent">
  We use analytics to improve the app. 
  <button onclick="acceptAnalytics()">Accept</button>
</div>
```

---

## 📈 Key Metrics to Track

For **app improvement**, focus on:

1. **User Engagement**
   - Daily/monthly active users
   - Session duration
   - Return rate

2. **Feature Usage**
   - Most used features
   - Least used features (consider removing)
   - Feature adoption rate

3. **Routes**
   - Most popular routes
   - Average trip distance
   - Quiet route vs standard route usage

4. **Sensory Reports**
   - Most reported noisy areas
   - Most reported quiet areas
   - Report frequency by location

5. **Errors**
   - Most common errors
   - Failed API calls
   - Browser compatibility issues

6. **User Flow**
   - Where users drop off
   - Conversion funnel (visitor → sign-up → active user)

---

## 🚀 Implementation Priority

**Week 1:** Google Analytics (easiest, most powerful)
**Week 2:** Custom events for routes and sensory reports
**Week 3:** Backend analytics if needed
**Week 4:** A/B testing and optimization

---

## 💡 Pro Tips

1. **Don't over-track** - Focus on actionable metrics
2. **Test locally first** - Filter out your own traffic in GA
3. **Set up alerts** - Get notified of errors or spikes
4. **Regular reviews** - Check analytics weekly
5. **Privacy first** - Be transparent with users

---

## Need Help?

- Google Analytics Help: https://support.google.com/analytics
- Privacy policy generator: https://www.privacypolicygenerator.info/
- GDPR compliance: https://gdpr.eu/

---

**Ready to implement?** Start with Google Analytics - it's the fastest way to get insights!
