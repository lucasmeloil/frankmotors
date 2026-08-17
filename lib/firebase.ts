// Firebase SDK
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Baby Motos Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMw3BfO7LV0hee6qa483d1OEzmb5MKQQM",
  authDomain: "babymotos.firebaseapp.com",
  projectId: "babymotos",
  storageBucket: "babymotos.firebasestorage.app",
  messagingSenderId: "73690966474",
  appId: "1:73690966474:web:3ff93389c41138a77cc733",
  measurementId: "G-S9MWCK0EYV",
  databaseURL: "https://babymotos-default-rtdb.firebaseio.com/"
};

// Initialize Firebase (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Use initializeFirestore with auto-detect long polling to prevent hanging WebChannels
let db: ReturnType<typeof getFirestore>;
try {
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
} catch {
  db = getFirestore(app);
}

const storage = getStorage(app);
const rtdb = getDatabase(app);

export { app, auth, db, storage, rtdb };
