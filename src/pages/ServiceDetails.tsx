
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useServices } from '@/hooks/useSupabaseData';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';

const ServiceDetails = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { data: services, isLoading, error } = useServices();
  
  const service = services?.find(service => service.id === serviceId);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-10 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse">Loading service details...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Error loading service details. Please try again later.
          </div>
        ) : !service ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Service Not Found</h1>
            <p className="text-lg mb-4">The service you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/services">Browse All Services</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <Clock className="h-4 w-4" />
              <span>{service.duration} minutes</span>
              <DollarSign className="h-4 w-4 ml-4" />
              <span>${Number(service.price).toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Service Description</h2>
                  <p className="text-muted-foreground">
                    {service.description || 'No description available for this service.'}
                  </p>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-2">What's Included</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Comprehensive examination</li>
                      <li>Professional service by certified technicians</li>
                      <li>Quality parts and materials</li>
                      <li>Service warranty</li>
                    </ul>
                  </div>
                </Card>
                
                <div className="mt-6">
                  <Button asChild size="lg" className="w-full md:w-auto">
                    <Link to={`/service-reservation/${service.id}`}>
                      Book This Service
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Service Details</h2>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-muted-foreground">{service.duration} minutes</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Price</p>
                        <p className="text-muted-foreground">${Number(service.price).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Provider</p>
                        <p className="text-muted-foreground">
                          {service.provider_id ? 'Available at selected service centers' : 'Multiple locations available'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetails;
