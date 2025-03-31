
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ServiceDetails = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-10">
        <h1 className="text-3xl font-bold mb-6">Service Details</h1>
        <p className="text-lg mb-4">Service ID: {serviceId}</p>
        <div className="border rounded-lg p-6">
          <p className="text-muted-foreground">
            Detailed information about this service would be displayed here.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetails;
