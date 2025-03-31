
import React from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App.tsx';
import './index.css';
import { Capacitor } from '@capacitor/core';
import './i18n'; // Import i18n configuration

// Initialize Capacitor when running as native app
if (Capacitor.isNativePlatform()) {
  // Call the element loader after the platform has been bootstrapped
  defineCustomElements(window);
}

// Register the service worker
if ('serviceWorker' in navigator && !Capacitor.isNativePlatform()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

const root = createRoot(document.getElementById("root")!);

// Explicitly wrap the App in React.StrictMode here instead of in App.tsx
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
