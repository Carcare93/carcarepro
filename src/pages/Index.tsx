import React from 'react';
import Home from './Home';

// This component now just serves as a pass-through to Home
// We keep it for backward compatibility with existing routes
const Index = () => {
  return <Home />;
};

export default Index;
