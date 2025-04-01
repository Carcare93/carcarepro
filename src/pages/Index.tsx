
import React from 'react';
import { Navigate } from 'react-router-dom';

// This component now just redirects to Home instead of rendering it
// This prevents potential issues with nested routes and authentication redirects
const Index = () => {
  return <Navigate to="/home" replace />;
};

export default Index;
