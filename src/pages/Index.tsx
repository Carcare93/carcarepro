
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Redirect to home with the auth context properly initialized
const Index = () => {
  // Even though we're not using the auth context here,
  // initialize it to ensure it's available to the Home component
  try {
    // This will throw an error if the auth context is not properly initialized
    useAuth();
    return <Navigate to="/home" replace />;
  } catch (error) {
    console.error("Auth context error:", error);
    // Fallback to navigate to home even if auth context isn't available
    return <Navigate to="/home" replace />;
  }
};

export default Index;
