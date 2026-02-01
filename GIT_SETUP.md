# Important: Running Zone Validation After Cloning from Git

## Issue: VS Code Live Preview Port Interference

If you clone this repo and run it locally, **VS Code's Live Preview may intercept port 3000**. This causes the server to not respond correctly to API calls.

## Solutions:

### Option 1: Use Different Port (Easiest)
```bash
# Set PORT environment variable before running
$env:PORT=5000
npm start

# Or on Linux/Mac:
PORT=5000 npm start
```

### Option 2: Disable VS Code Live Preview
1. Open VS Code Settings (Ctrl+,)
2. Search for "livePreview"
3. Disable "Live Preview" extension
4. Restart VS Code
5. Run `npm start` on port 3000

### Option 3: Use PM2 (Recommended for Production)
```bash
npm install -g pm2
pm2 start server.js --name zone-validation
pm2 save
pm2 startup
```

### Option 4: Deploy to Cloud
- Heroku
- Azure App Service
- AWS Lambda
- DigitalOcean

See [DEPLOYMENT.md](DEPLOYMENT.md) for cloud deployment options.

## Verify Server is Running

After starting with `npm start`, check if the API responds:

```bash
# Linux/Mac:
curl http://localhost:3000/api/test

# Windows PowerShell:
Invoke-RestMethod -Uri "http://localhost:3000/api/test" -Method GET
```

You should see:
```json
{"message":"API working","timestamp":"2026-02-02T..."}
```

## Git Clone & Run

```bash
# Clone repository
git clone https://github.com/malladitya/rivomaps.git
cd rivomaps

# Install dependencies
npm install

# Run server (will use port 3000 or PORT env var)
npm start

# In another terminal, test the API
node test-zone-validation.js
```

## All Files Committed ✅

These files are now in git and ready for deployment:
- `server.js` - Main Express server
- `backend/models/` - NoiseZone, User, ZoneReport models
- `backend/services/zoneValidation.js` - Core validation logic
- `ZoneReporter.js` - Client SDK
- `ZONE_VALIDATION_GUIDE.md` - Full documentation
- `DEPLOYMENT.md` - Deployment instructions
- `package.json` - Dependencies configured

## Quick Test After Cloning

```bash
# Terminal 1
npm start

# Terminal 2
node test-zone-validation.js
```

You should see test results showing zone verification working correctly.

## For Hackathon

When presenting/demonstrating:
1. Clone from git
2. Run `npm install` (one-time setup)
3. Run `npm start`
4. Show API working with curl or test script
5. Explain the verification system to judges

The zone validation system will work identically regardless of which port you use!
