# 📊 Google Analytics Setup Guide - Collect Your User Data

## Quick Start (5 minutes)

### Step 1: Create Google Analytics Account

1. Go to **https://analytics.google.com/**
2. Click "Start measuring" or "Admin" (bottom left)
3. Create a new **Property**:
   - Property name: `Rivo Maps`
   - Reporting time zone: Your timezone
   - Currency: Your currency
4. Click "Next" → Choose "Web" platform
5. Enter your website details:
   - Website name: `Rivo Maps`
   - Website URL: `http://localhost:3000` (or your domain)
   - Industry: Transportation
6. Click "Create stream"

### Step 2: Get Your Measurement ID

After creating the stream, you'll see:
```
Measurement ID: G-XXXXXXXXXX
```

**Copy this ID!** You'll need it in the next step.

### Step 3: Update Your App

Open [analytics-setup.js](analytics-setup.js) and replace the Measurement ID:

```javascript
// Line 149-154 in analytics-setup.js
if (typeof window.rivoAnalytics === 'undefined') {
  window.rivoAnalytics = new RivoAnalytics('G-XXXXXXXXXX'); // ← Replace with YOUR ID
}
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID from Step 2.

### Step 4: Test It!

1. Open your app in a browser
2. Open browser console (F12)
3. You should see: `Rivo Analytics initialized`
4. Go to **Google Analytics** → **Reports** → **Realtime**
5. You should see 1 active user (you!)

---

## 📈 What Data You'll Collect

Your app is now tracking:

### 1. **Route Planning**
- Origin and destination searches
- Route calculations (distance, duration, type)
- Comfort vs speed preferences
- Live location usage

### 2. **Community Reports**
- Noise zone reports (location, severity)
- Crowded area reports (location, density)
- Construction reports (location)

### 3. **User Engagement**
- Sign-ins (email, Google)
- AI chatbot usage
- Feature usage (live tracking, turn-by-turn, etc.)
- Page views

### 4. **Navigation Behavior**
- Route recalculations
- Live location tracking
- Turn-by-turn navigation usage

---

## 📊 View Your Data

### Real-time Reports
https://analytics.google.com/ → Reports → Realtime

See users online right now, their location, and what they're doing.

### User Insights
https://analytics.google.com/ → Reports → User → Demographics

Understand who your users are.

### Event Tracking
https://analytics.google.com/ → Reports → Engagement → Events

See all tracked events:
- `route_search` - When users search for routes
- `route_calculated` - When routes are calculated
- `sensory_report` - When users report noise/crowds
- `feature_used` - When users use specific features
- `login` - When users sign in

### Custom Reports
https://analytics.google.com/ → Explore → Create Report

Build custom dashboards to answer questions like:
- Which routes are most popular?
- What time of day do users search for routes?
- What sensory issues are reported most?
- How many users prefer comfort over speed?

---

## 🔍 Example Queries

### Most Popular Routes
1. Go to **Reports** → **Engagement** → **Events**
2. Select event: `route_search`
3. Add secondary dimension: `event_label`
4. See most searched origin-destination pairs

### User Preferences
1. Go to **Reports** → **Engagement** → **Events**
2. Select event: `preference_change`
3. See what settings users adjust most

### Community Reports by Type
1. Go to **Reports** → **Engagement** → **Events**
2. Select event: `sensory_report`
3. Add dimension: `report_type`
4. See breakdown: noise vs crowd vs construction

---

## 🎯 Privacy & GDPR Compliance

**Important:** You're collecting user location data. Make sure to:

1. **Add Privacy Policy**
   - Explain what data you collect
   - How you use it
   - User rights

2. **Get User Consent**
   - Add a cookie/tracking consent banner
   - Only enable analytics after consent

3. **Anonymize IP Addresses**
   Already configured in [analytics-setup.js](analytics-setup.js):
   ```javascript
   gtag('config', this.measurementId, {
     anonymize_ip: true  // ✅ Already enabled
   });
   ```

4. **Allow Opt-Out**
   Add this function to let users disable tracking:
   ```javascript
   window.disableAnalytics = function() {
     window['ga-disable-G-XXXXXXXXXX'] = true;
     alert('Analytics disabled');
   };
   ```

---

## 🚀 Advanced: Custom Events

Track custom interactions:

```javascript
// Example: Track when user shares a route
rivoAnalytics.trackCustomEvent('route_shared', {
  event_category: 'Social',
  method: 'whatsapp',
  from: 'Chandigarh',
  to: 'Delhi'
});

// Example: Track AI suggestions used
rivoAnalytics.trackCustomEvent('ai_suggestion_used', {
  event_category: 'AI',
  suggestion_type: 'quiet_route',
  confidence: 0.95
});
```

---

## 📱 Test Your Setup

Open [analytics-dashboard.html](analytics-dashboard.html) in your browser to:
- ✅ Verify Google Analytics is active
- 🧪 Send test events
- 📊 See your Measurement ID
- 🔗 Quick link to your GA dashboard

---

## 🐛 Troubleshooting

### Not seeing data in Google Analytics?

1. **Check Measurement ID**
   - Open browser console (F12)
   - Look for: `Rivo Analytics initialized`
   - Make sure ID format is `G-XXXXXXXXXX`

2. **Check Network Requests**
   - Open browser Dev Tools → Network tab
   - Look for requests to `www.google-analytics.com`
   - If blocked, check ad blockers/privacy extensions

3. **Wait 24-48 hours**
   - Some reports update with a delay
   - Real-time reports show data immediately
   - Historical reports may take 1-2 days

### Still not working?

- Verify you're on the **GA4** property (not Universal Analytics)
- Check if your browser has "Do Not Track" enabled
- Disable ad blockers for testing
- Try in incognito mode

---

## 📖 Resources

- **Google Analytics Help**: https://support.google.com/analytics
- **GA4 Documentation**: https://developers.google.com/analytics/devguides/collection/ga4
- **Event Reference**: https://support.google.com/analytics/answer/9267735

---

## ✅ Setup Complete!

You're now collecting valuable user data to improve Rivo Maps! 🎉

Check your data:
👉 https://analytics.google.com/

Questions? Check the troubleshooting section above.
