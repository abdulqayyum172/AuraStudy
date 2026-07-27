// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKAErpL0RaKxRCVnZLzAXDPC365f5XHHE",
  authDomain: "aurastudy-af127.firebaseapp.com",
  projectId: "aurastudy-af127",
  storageBucket: "aurastudy-af127.firebasestorage.app",
  messagingSenderId: "250261843408",
  appId: "1:250261843408:web:462073aa9b1e9ea9045dd5",
  measurementId: "G-RVB8N5Y82X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Helper: Sign in with Google popup
const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Helper: Sign in with Apple popup
const signInWithApple = () => signInWithPopup(auth, appleProvider);

// Helper: Email/Password login
const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Helper: Email/Password signup
const registerWithEmail = async (email, password, displayName) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  return result;
};

// Helper: Logout
const logout = () => signOut(auth);

export {
  app,
  analytics,
  auth,
  googleProvider,
  appleProvider,
  signInWithGoogle,
  signInWithApple,
  loginWithEmail,
  registerWithEmail,
  logout,
  onAuthStateChanged,
};
