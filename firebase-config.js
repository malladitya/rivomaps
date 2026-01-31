//  For Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpRStd3cJuavDoB87i_6OLS7krIl8Kkvc",
  authDomain: "rivo-maps-82621.firebaseapp.com",
  projectId: "rivo-maps-82621",
  storageBucket: "rivo-maps-82621.firebasestorage.app",
  messagingSenderId: "637853454886",
  appId: "1:637853454886:web:deec1ee29aadbd22a7cce7",
  measurementId: "G-HB4V1F8S52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore (optional, for storing user data)
export const db = getFirestore(app);

export default app;
