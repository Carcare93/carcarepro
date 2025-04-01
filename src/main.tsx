
import React from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { Capacitor } from '@capacitor/core';
import './i18n'; // Import i18n configuration

// Create a client
const queryClient = new QueryClient();

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

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

// Render with QueryClientProvider but without another StrictMode
// since App.tsx already includes StrictMode
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
