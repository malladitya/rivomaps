# 🚀 Google Analytics - Quick Start

## ⚡ 3-Step Setup (5 minutes)

### 1️⃣ Create Google Analytics Account
👉 https://analytics.google.com/  
Click "Start measuring" → Create Property → Get **Measurement ID** (G-XXXXXXXXXX)

### 2️⃣ Add Your ID
Open [analytics-setup.js](analytics-setup.js) (line 152):
```javascript
window.rivoAnalytics = new RivoAnalytics('G-XXXXXXXXXX'); // ← Your ID here
```

### 3️⃣ Done!
Open your app → Check Google Analytics → See live users! 🎉

---

## 📊 What Data You're Collecting

✅ **Route searches** - Origin, destination, distance  
✅ **User reports** - Noise, crowds, construction  
✅ **Feature usage** - Live location, AI chatbot, navigation  
✅ **User sessions** - Page views, time spent, device type  
✅ **Errors** - JavaScript errors for debugging  

---

## 🔍 View Your Data

**Real-time users:** https://analytics.google.com/ → Realtime  
**All events:** Reports → Engagement → Events  
**Popular routes:** Events → route_search → event_label  

---

## 📁 Key Files

- [analytics-setup.js](analytics-setup.js) - Core analytics code
- [GOOGLE_ANALYTICS_SETUP.md](GOOGLE_ANALYTICS_SETUP.md) - Full setup guide  
- [ANALYTICS_DATA_COLLECTED.md](ANALYTICS_DATA_COLLECTED.md) - All tracked data  
- [analytics-dashboard.html](analytics-dashboard.html) - Test page  

---

## ✅ Tracking Active On:

### Route Planning
📍 [script.js](script.js) line 530 - Route search tracking  
📊 [script.js](script.js) line 540 - Route calculation tracking  
🔄 [index.html](index.html) line 1611 - Route recalculation  

### Community Reports  
🔊 [script.js](script.js) line 304 - Noise reports  
👥 [script.js](script.js) line 327 - Crowd reports  
🚧 [script.js](script.js) line 352 - Construction reports  

### Features
📱 [index.html](index.html) line 1567 - Live location  
🤖 [ai-action-handler.js](ai-action-handler.js) line 215 - AI routes  
🔐 [index.html](index.html) lines 2087, 2134 - User login  

---

## 🧪 Test Your Setup

1. Open [analytics-dashboard.html](analytics-dashboard.html)
2. Click "Send Test Events" buttons
3. Check Google Analytics → Realtime
4. See events appear! ✅

---

## ❓ Not Working?

1. Check Measurement ID format: `G-XXXXXXXXXX`
2. Look for console message: "Rivo Analytics initialized"
3. Disable ad blockers
4. Wait 5 minutes, check Realtime reports

---

## 📖 Full Documentation

**Complete Guide:** [GOOGLE_ANALYTICS_SETUP.md](GOOGLE_ANALYTICS_SETUP.md)  
**Data Overview:** [ANALYTICS_DATA_COLLECTED.md](ANALYTICS_DATA_COLLECTED.md)  
**Original Guide:** [ANALYTICS_SETUP_GUIDE.md](ANALYTICS_SETUP_GUIDE.md)

---

**Need help?** Check the troubleshooting section in [GOOGLE_ANALYTICS_SETUP.md](GOOGLE_ANALYTICS_SETUP.md)
