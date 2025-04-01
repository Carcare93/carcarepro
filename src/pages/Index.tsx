
import React from 'react';
import { Navigate } from 'react-router-dom';

// Simply redirect to home without any conditional logic
const Index = () => {
  return <Navigate to="/home" replace />;
};

export default Index;
