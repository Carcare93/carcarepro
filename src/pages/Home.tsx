
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ServiceProviders from '@/components/home/ServiceProviders';
import CallToAction from '@/components/home/CallToAction';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  // Wrap auth context usage in try-catch to prevent the app from breaking
  // if the context is not available
  let user = null;
  let isAuthenticated = false;
  let isLoading = true;
  const navigate = useNavigate();

  try {
    const auth = useAuth();
    user = auth.user;
    isAuthenticated = auth.isAuthenticated;
    isLoading = auth.isLoading;
  } catch (error) {
    console.error("Error accessing auth context:", error);
  }

  useEffect(() => {
    // Only handle redirects if we have successfully accessed the auth context
    if (user && user.accountType === 'provider') {
      console.log("Provider detected, redirecting to provider dashboard");
      navigate('/provider', { replace: true });
      return;
    }

    // Handle hash navigation
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  // Render the home page content regardless of auth state
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <ServiceProviders />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
