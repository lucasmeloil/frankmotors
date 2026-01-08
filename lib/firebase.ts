// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGgVPCWPkZWlq4ZXVQ3lNrLBd8_XK_-ms",
  authDomain: "frankmo-e0419.firebaseapp.com",
  projectId: "frankmo-e0419",
  storageBucket: "frankmo-e0419.firebasestorage.app",
  messagingSenderId: "791024968636",
  appId: "1:791024968636:web:0c8c065042d3eb5c97c1b9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
