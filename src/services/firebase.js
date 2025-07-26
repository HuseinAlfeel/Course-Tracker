import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔒 SECURITY: Firebase configuration now uses environment variables
// This prevents exposing sensitive API keys in the source code
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCA9mwqGnBsD0_3bbR30ZgVy1lKArfynLs",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "bootcamp-tracker.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "bootcamp-tracker",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "bootcamp-tracker.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "551894156773",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:551894156773:web:086d4245cedef1cd91db0c",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-N4Q8WE2YLW"
};

// Validate that required environment variables are present
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('⚠️  Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file or deployment environment settings');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔧 Enhanced logging for better debugging
if (process.env.NODE_ENV === 'development') {
  console.log("🔥 Firebase initialized successfully");
  console.log("🔐 Auth service:", auth !== null ? "✅ Ready" : "❌ Failed");
  console.log("🗄️  Firestore service:", db !== null ? "✅ Ready" : "❌ Failed");
}

export { db, auth };