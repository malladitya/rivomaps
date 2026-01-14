# 📸 Google Cloud Vision API Integration Guide

## Overview
Your Rivo app now integrates with **Google Cloud Vision API** to analyze images for sensory-related issues like noise, crowds, and hazards. Users can upload photos of locations, and the API automatically detects and creates sensory reports.

---

## Setup Instructions

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"**
3. Name it `rivo-vision-api` and click **Create**

### 2. Enable Vision API
1. In the Cloud Console, go to **APIs & Services > Library**
2. Search for **"Cloud Vision API"**
3. Click **Enable**

### 3. Create a Service Account
1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > Service Account**
3. Fill in the details:
   - **Service account name**: `rivo-vision-service`
   - Click **Create and Continue**
4. Grant roles:
   - Select **Basic > Viewer** role
   - Click **Continue > Done**

### 4. Create and Download API Key
1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key > Create new key**
4. Choose **JSON** format
5. Click **Create** - a JSON file will download

### 5. Setup Your Server
1. Place the downloaded JSON file in your `rivomaps/` folder and rename it to `vision-key.json`
2. Install the Google Cloud Vision package:
```bash
npm install @google-cloud/vision
```

3. Update `server.js` to use the key:
```javascript
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
  keyFilename: './vision-key.json'
});
```

### 6. Set Environment Variable (Alternative)
Instead of storing the key file directly, you can set an environment variable:

**Windows (PowerShell):**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\vision-key.json"
npm start
```

**Windows (CMD):**
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\vision-key.json
npm start
```

**macOS/Linux:**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/vision-key.json"
npm start
```

---

## How It Works

### User Flow
1. User clicks **"📸 Upload Image"** on the Rivo app
2. Selects a photo of their current location
3. App sends image to your backend
4. Backend calls Google Cloud Vision API
5. Vision API analyzes:
   - **Labels** (what objects/scenes are detected)
   - **Objects** (specific items in the image)
   - **Text** (signs, notices, etc.)
   - **Safety** (inappropriate content detection)

### Analysis Results
The API returns a **sensory analysis** with:
- **🔊 Noise Level** (0-100%) - Detects traffic, construction, crowds
- **👥 Crowd Density** (0-100%) - Identifies populated areas
- **⚠️ Hazard Level** (0-100%) - Detects construction, obstacles
- **🌿 Calm Factor** (0-100%) - Identifies parks, quiet spaces
- **Recommendation** - Sensory-friendly route suggestion

### Automatic Report Creation
Based on analysis results:
- **Noise > 60%** → Creates "Noise" report
- **Crowd > 60%** → Creates "Crowd" report
- **Hazard > 50%** → Creates "Construction" report
- Reports are added to the map automatically

---

## API Endpoints

### Analyze Image
**POST** `/api/vision/analyze`

**Request:**
```json
{
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJ..."
}
```

**Response:**
```json
{
  "success": true,
  "labels": [
    {
      "description": "traffic",
      "score": 0.95
    },
    {
      "description": "road",
      "score": 0.88
    }
  ],
  "objects": [],
  "text": "",
  "sensoryAnalysis": {
    "noiseLevel": 0.75,
    "crowdDensity": 0.2,
    "hazardLevel": 0.1,
    "calmFactor": 0.15,
    "recommendation": "⚠️ Noisy area detected - Consider alternative route",
    "confidence": 0.75
  }
}
```

---

## Testing

### Test with the UI
1. Open Rivo app in browser
2. Scroll to **"📸 Analyze with Image"** section
3. Click **"📸 Upload Image"**
4. Select an image from your device
5. See results in 2-3 seconds

### Test with cURL
```bash
curl -X POST http://localhost:3000/api/vision/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageData":"data:image/jpeg;base64,..."}'
```

---

## Important Notes

### Security
⚠️ **Never commit `vision-key.json` to Git!**
- Add to `.gitignore`:
```
vision-key.json
.env
```

### Cost Management
- Vision API has a free tier (1000 requests/month)
- After that: $1.50 per 1000 requests
- Monitor usage in Google Cloud Console

### Limitations
- Images must be less than 20MB (usually < 5MB for web)
- Supports: JPEG, PNG, GIF, WebP, RAW, TIFF
- Base64 images are sent to Google (privacy consideration)

---

## File Changes Summary

### Modified Files
1. **server.js**
   - Added Vision API client initialization
   - New endpoint: `POST /api/vision/analyze`
   - Sensory context analysis function

2. **script.js**
   - `analyzeImageWithVision()` - Call Vision API
   - `createSensoryReportFromImage()` - Create reports from analysis
   - `fileToBase64()` - Convert file to base64
   - Event listener for image upload

3. **index.html**
   - Added image upload UI section
   - File input for image selection
   - Results display area

---

## Troubleshooting

### "credentials not found" error
→ Make sure `vision-key.json` is in the root of `rivomaps/` folder

### "Vision API not enabled" error
→ Go to [Google Cloud Console](https://console.cloud.google.com/) and enable Cloud Vision API

### Images not being analyzed
→ Check that:
- Server is running (`npm start`)
- Network tab shows request to `/api/vision/analyze`
- Google Cloud credentials are valid

### CORS errors
→ Already handled - `cors()` middleware is enabled in server.js

---

## Next Steps

1. ✅ Downloaded Google Cloud Vision API key
2. ✅ Installed `@google-cloud/vision` package
3. ✅ Added `vision-key.json` to your project
4. ✅ Started the server: `npm start`
5. ✅ Test with image uploads in the UI

**You're all set! Start using image analysis now! 🚀**
