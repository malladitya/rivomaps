# Enable Firestore - Step by Step

## 🎯 Quick 2-Minute Setup

### Step 1: Open Firebase Console

Go to: **https://console.firebase.google.com/project/rivo-maps-82621/firestore**

(Or navigate: Firebase Console → Your Project "rivo-maps-82621" → Build → Firestore Database)

---

### Step 2: Create Database

Click the big **"Create database"** button

---

### Step 3: Choose Security Mode

Select: **"Start in production mode"**

> This starts with secure rules. We'll customize them next.

Click **"Next"**

---

### Step 4: Select Location

Choose the closest region to your users:

- **nam5 (us-central)** - United States
- **eur3 (europe-west)** - Europe
- **asia-southeast1** - Singapore/Asia

Click **"Enable"**

⏳ Wait 30-60 seconds for database creation...

---

### Step 5: Set Security Rules

1. Click on **"Rules"** tab at the top

2. Replace everything with this code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

---

### Step 6: Test It!

1. Open: http://localhost:51488/auth-test.html
2. Sign in with your account
3. Go to: http://localhost:51488/rivo.html
4. Calculate a route
5. Click **"Save Current Route"**
6. Give it a name
7. Success! ✅

---

## ✅ Verify It's Working

### Check Firestore Console

1. Go to: **Firestore Database** → **Data** tab
2. You should see a `users` collection
3. Click it to see your user document
4. Expand to see your saved route!

### Check in Your App

1. Click your avatar (top-right in rivo.html)
2. Click "Favorite Routes"
3. You should see your saved route
4. Click "Load Route" to test it loads correctly

---

## 🐛 If Something Doesn't Work

### Error: "Insufficient permissions"

**Fix**: Double-check security rules are published correctly

### Error: "Firestore is not enabled"

**Fix**: Wait 1-2 minutes after enabling, then refresh page

### Error: "Network error"

**Fix**: 
1. Check internet connection
2. Verify you're on HTTPS or localhost
3. Clear browser cache

### Routes save but don't appear

**Fix**:
1. Sign out and sign back in
2. Hard refresh page (Ctrl+F5)
3. Check browser console for errors

---

## 🎉 You're Done!

Your Firestore database is now:
- ✅ Enabled
- ✅ Secured with proper rules
- ✅ Connected to your app
- ✅ Ready to store user data

Now you can:
- 💾 Save favorite routes
- 📜 Track search history
- ⚙️ Store user preferences
- 🔄 Sync across devices

---

## 📊 What Gets Stored

Every time a user:

| Action | Data Saved |
|--------|-----------|
| Signs up | Email, name, creation date |
| Saves route | Route name, origin, destination, distance |
| Calculates route | Origin & destination in search history |
| Changes preferences | User settings (noise tolerance, etc.) |

All data is:
- 🔒 **Private** - Only accessible by that user
- ☁️ **Cloud-based** - Accessible from any device
- 🔄 **Real-time** - Syncs instantly
- 💾 **Persistent** - Never lost unless user deletes

---

## 🚀 Next: Explore Your Data

### View All User Data
```
Firebase Console → Firestore → Data tab → users collection
```

### Search for Specific User
```
Click "Filter" → Field path: email → Operator: == → Value: user@example.com
```

### Export Data
```
Cloud Firestore → Import/Export → Export
```

### Monitor Usage
```
Firestore → Usage tab → See read/write stats
```

---

**Congratulations! Your Rivo Maps app now has a powerful database backend! 🎊**
