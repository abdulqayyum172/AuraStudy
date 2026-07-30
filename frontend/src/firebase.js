// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

// Initialize Cloud Messaging
let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.warn('Firebase Messaging initialization failed:', err);
  }
}

// VAPID key for push notifications (Web Push certificates from Firebase Console)
// To get this key: Firebase Console > Project Settings > Cloud Messaging > Web Push certificates > Generate key pair
export const VAPID_KEY = 'BNxC8vHnXZQgZFmJKT8h_wQZhXVJ8nHKQr3YVKqLpM8fX5gZVr4hJnK8mQr3YVKqLpM8fX5gZVr4hJnK8mQr3Y';

// Request FCM token
export const requestFCMToken = async () => {
  if (!messaging) {
    console.warn('Messaging not initialized');
    return null;
  }
  
  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    return token;
  } catch (err) {
    console.error('Error getting FCM token:', err);
    return null;
  }
};

// Listen for foreground messages
export const onForegroundMessage = (callback) => {
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
};

// Helper: Sign in with Google (popup preferred, redirect fallback)
const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (popupError) {
    if (popupError.code === 'auth/popup-blocked') {
      throw new Error('Please allow popups for this site to sign in with Google.');
    }
    // Popup failed for any other reason (e.g. third-party cookie blocking, popup closed by user) — try redirect fallback
    console.warn('Google sign-in popup failed, falling back to redirect flow:', popupError.code);
    await signInWithRedirect(auth, googleProvider);
  }
};

// Helper: Sign in with Apple (popup preferred, redirect fallback)
const signInWithApple = async () => {
  try {
    await signInWithPopup(auth, appleProvider);
  } catch (popupError) {
    if (popupError.code === 'auth/popup-blocked') {
      throw new Error('Please allow popups for this site to sign in with Apple.');
    }
    // Popup failed for any other reason — try redirect fallback
    console.warn('Apple sign-in popup failed, falling back to redirect flow:', popupError.code);
    await signInWithRedirect(auth, appleProvider);
  }
};

// Helper: Handle redirect result (call on app mount)
const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      if (auth.currentUser) {
        return { user: auth.currentUser };
      }
      console.log('Popup blocked/closed during redirect, this is expected in some browsers');
      return { user: null };
    }
    console.error('Redirect result error:', error);
    throw error;
  }
};

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
  messaging,
  googleProvider,
  appleProvider,
  signInWithGoogle,
  signInWithApple,
  handleRedirectResult,
  loginWithEmail,
  registerWithEmail,
  logout,
  onAuthStateChanged,
};
