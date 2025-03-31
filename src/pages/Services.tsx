
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-10">
        <h1 className="text-3xl font-bold mb-6">Our Services</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We offer a range of services to keep your vehicle running smoothly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service cards would go here */}
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Oil Change</h2>
            <p className="text-muted-foreground">Regular oil changes to keep your engine healthy.</p>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Brake Service</h2>
            <p className="text-muted-foreground">Inspection and replacement of brake components.</p>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Tire Rotation</h2>
            <p className="text-muted-foreground">Even wear for longer tire life and better handling.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
