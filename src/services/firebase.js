/**
 * Firebase Configuration & Service Initialization
 * 
 * Supports both Live Firebase (via environment variables) and
 * graceful local persistence fallback when API keys are pending.
 */

import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Read from Vite Environment Variables (.env or .env.local)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDu9hPAasRcjvaVmKKnE1LtjpTG-moLr08",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kalaakshi-79de0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kalaakshi-79de0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kalaakshi-79de0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "588495393310",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:588495393310:web:fb17b87a21357879d3d40f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HSMJQXWLS6"
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyDummyKeyForLocalDevelopment12345"
);

// Initialize Firebase App instance
let app;
let auth;
let db;
let storage;
let googleProvider;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (err) {
  console.warn('Firebase initialization in fallback mode:', err);
}

export { 
  app, 
  auth, 
  db, 
  storage, 
  googleProvider,
  // Auth Helpers
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  // Firestore Helpers
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
};
