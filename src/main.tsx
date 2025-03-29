
import { createRoot } from 'react-dom/client'
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App.tsx'
import './index.css'
import { Capacitor } from '@capacitor/core';

// Initialize Capacitor when running as native app
if (Capacitor.isNativePlatform()) {
  // Call the element loader after the platform has been bootstrapped
  defineCustomElements(window);
}

createRoot(document.getElementById("root")!).render(<App />);
