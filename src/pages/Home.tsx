
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ServiceProviders from '@/components/home/ServiceProviders';
import CallToAction from '@/components/home/CallToAction';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if user is authenticated and this is not a direct navigation to /home
    if (isAuthenticated && user && location.pathname === '/home') {
      console.log("User authenticated on home page:", user.accountType);
      if (user.accountType === 'provider') {
        console.log("Redirecting provider to provider dashboard");
        navigate('/provider', { replace: true });
        return;
      }
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
  }, [isAuthenticated, user, navigate, location.pathname]);

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
