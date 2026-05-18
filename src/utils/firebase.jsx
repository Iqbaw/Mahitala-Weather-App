import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-dZryTn5E_u6NUFFwDgssV9ppbKLbbNk",
  authDomain: "mahitala-weather.firebaseapp.com",
  projectId: "mahitala-weather",
  storageBucket: "mahitala-weather.firebasestorage.app",
  messagingSenderId: "625460952768",
  appId: "1:625460952768:web:280b42aae906d85946b725",
  measurementId: "G-LNP6JZ5LZ6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin email
const ADMIN_EMAIL = "iqbawawbatmee@gmail.com";

export {
  app,
  auth,
  db,
  ADMIN_EMAIL,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
};
