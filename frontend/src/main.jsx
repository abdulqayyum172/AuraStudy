import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './firebase.js'
import App from './App.jsx'

// Register Firebase Messaging Service Worker for push notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('[SW] Service Worker registered:', registration.scope);
    })
    .catch((error) => {
      console.error('[SW] Service Worker registration failed:', error);
    });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
