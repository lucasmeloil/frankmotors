// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxHEXlQcdfU92usVhW8rSXlUTsOeyN7yQ",
  authDomain: "cabo-car.firebaseapp.com",
  projectId: "cabo-car",
  storageBucket: "cabo-car.firebasestorage.app",
  messagingSenderId: "492069895631",
  appId: "1:492069895631:web:119b7d806f6b15b4ef66ba",
  measurementId: "G-4N49HJ66LL"
};

// Initialize Firebase (Singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics safely on client
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Authentication Service
const auth = getAuth(app);

// Firestore Database Service
let db: ReturnType<typeof getFirestore>;
try {
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
} catch {
  db = getFirestore(app);
}

// Storage and Realtime Database
const storage = getStorage(app);
const rtdb = getDatabase(app);

export { app, auth, db, storage, rtdb, analytics, firebaseConfig };
