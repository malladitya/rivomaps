# Firebase Authentication Setup Guide

## 🚀 Quick Start

You've successfully installed Firebase! Now follow these steps to complete the setup.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: **Rivo Maps**
4. (Optional) Enable Google Analytics
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon (</>)** to add a web app
2. Register app with nickname: **Rivo Web App**
3. (Optional) Check "Also set up Firebase Hosting" if you want to deploy later
4. Click "Register app"

## Step 3: Get Your Firebase Config

You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "rivo-maps.firebaseapp.com",
  projectId: "rivo-maps",
  storageBucket: "rivo-maps.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**Copy this entire configuration!**

## Step 4: Update firebase-config.js

1. Open `firebase-config.js` in your project
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

## Step 5: Enable Authentication Methods

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable the following providers:

### Email/Password
- Click on "Email/Password"
- Toggle "Enable"
- Click "Save"

### Google Sign-In (Recommended)
- Click on "Google"
- Toggle "Enable"
- Select a support email
- Click "Save"

## Step 6: Configure Authorized Domains

1. In Authentication → Settings → Authorized domains
2. Add your domains:
   - `localhost` (already added by default)
   - Your production domain when you deploy

## Step 7: Test Your Setup

1. Start your development server:
   ```bash
   npm start
   ```
   Or open `auth-ui.html` directly in your browser

2. Open `auth-ui.html` in your browser
3. Try creating an account or signing in with Google

## 📁 Files Created

- **firebase-config.js** - Firebase initialization and configuration
- **firebase-auth.js** - Authentication functions (signup, signin, signout, etc.)
- **auth-ui.html** - Beautiful login/signup UI

## 🔧 Integration with Rivo Maps

To add authentication to your main Rivo app (`rivo.html`):

### Option 1: Redirect to Auth Page

Add this to your `rivo.html`:

```html
<script type="module">
  import { onAuthChange, getCurrentUser } from './firebase-auth.js';
  
  onAuthChange((user) => {
    if (!user) {
      window.location.href = 'auth-ui.html';
    } else {
      console.log('Logged in as:', user.email);
      // User is authenticated, show the app
    }
  });
</script>
```

### Option 2: Add Auth UI to Existing Page

You can create a modal or sidebar with auth forms in `rivo.html` and import the auth functions.

## 🎨 Customization

### Change Colors
Edit the CSS in `auth-ui.html`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add Profile Photo
Use Firebase Storage to upload and store user profile pictures.

### Add More Fields
Modify the signup form to collect additional user information and save to Firestore.

## 🔐 Security Rules (Optional but Recommended)

If you're using Firestore to store user data:

1. Go to **Firestore Database** → **Rules**
2. Add these basic security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Next Steps

1. **Store User Preferences**: Save favorite routes, search history
2. **Social Features**: Share routes with friends
3. **Premium Features**: Unlock features for authenticated users
4. **Analytics**: Track user behavior with Firebase Analytics
5. **Push Notifications**: Send route alerts with FCM

## 📚 Available Auth Functions

Import from `firebase-auth.js`:

- `signUpWithEmail(email, password, displayName)` - Create new account
- `signInWithEmail(email, password)` - Sign in existing user
- `signInWithGoogle()` - Google OAuth sign-in
- `signOutUser()` - Sign out current user
- `resetPassword(email)` - Send password reset email
- `onAuthChange(callback)` - Listen for auth state changes
- `getCurrentUser()` - Get current logged-in user

## ❓ Troubleshooting

### "Firebase not defined" error
Make sure you're using `type="module"` in your script tags:
```html
<script type="module" src="your-script.js"></script>
```

### Google Sign-In not working
1. Check that Google provider is enabled in Firebase Console
2. Verify authorized domains include your current domain
3. Make sure popup blockers are disabled

### CORS errors
Use a local development server instead of opening HTML files directly:
```bash
npx serve
# or
python -m http.server 8000
```

## 🎉 You're All Set!

Your Firebase Authentication is now configured. Open `auth-ui.html` to see it in action!

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs/auth)
