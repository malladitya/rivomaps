# 📦 Package Installation Required

## Install Google Cloud Vision Package

Google Cloud Vision API support requires the official Google Cloud library.

### Installation

Run this command in your `rivomaps/` directory:

```bash
npm install @google-cloud/vision
```

This will:
✅ Install `@google-cloud/vision` package
✅ Add to your `package.json`
✅ Update `package-lock.json`

### Verify Installation

After installation, you should see in `package.json`:
```json
{
  "dependencies": {
    "@google-cloud/vision": "^4.x.x",
    "cors": "^2.8.5",
    "express": "^4.x.x"
  }
}
```

### Check Version

```bash
npm list @google-cloud/vision
```

---

## Also Required: Google Cloud Credentials

You'll need to:
1. Create a Google Cloud project
2. Enable Vision API
3. Create a service account
4. Download JSON credentials as `vision-key.json`

👉 See **GOOGLE_VISION_SETUP.md** for complete setup steps

---

## Environment Variables (Optional)

Instead of using a key file, you can use environment variables:

**Windows PowerShell:**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\vision-key.json"
npm start
```

**Windows CMD:**
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

## What Gets Installed?

The `@google-cloud/vision` package includes:
- Vision API client library
- Automatic authentication
- Image annotation features:
  - Label detection
  - Object detection
  - Text recognition
  - Face detection
  - Safe search detection
  - And more!

All integrated into your Rivo app! 🚀
