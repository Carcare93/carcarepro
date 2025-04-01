
import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple redirect to home page
const Index = () => {
  return <Navigate to="/home" replace />;
};

export default Index;
