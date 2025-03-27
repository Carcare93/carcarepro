
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ServiceProviders from '@/components/home/ServiceProviders';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  useEffect(() => {
    // Smooth scroll to element when URL has hash
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Scroll to top when component mounts
      window.scrollTo(0, 0);
    }
  }, []);

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

export default Index;
