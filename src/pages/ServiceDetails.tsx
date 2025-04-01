
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin, DollarSign, Star, Phone, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ServiceProvider } from '@/types/supabase-models';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const ServiceDetails = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        setIsLoading(true);
        
        // Try to get the provider from Supabase
        const { data, error } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', serviceId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform the data to match the ServiceProvider type
          const providerData: ServiceProvider = {
            ...data,
            location: {
              address: data.address,
              city: data.city,
              state: data.state,
              zipCode: data.zip_code,
              coordinates: data.lat && data.lng ? { 
                lat: data.lat, 
                lng: data.lng 
              } : undefined
            }
          };
          
          setProvider(providerData);
        }
      } catch (err) {
        console.error('Error fetching provider details:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch provider details'));
        toast({
          variant: "destructive",
          title: "Error loading provider details",
          description: "Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (serviceId) {
      fetchProviderDetails();
    }
  }, [serviceId, toast]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-10 px-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-64 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Provider Not Found</h1>
            <p className="text-lg mb-4">We couldn't find the service provider you're looking for.</p>
            <Button asChild>
              <Link to="/services">Browse All Services</Link>
            </Button>
          </div>
        ) : !provider ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Provider Not Found</h1>
            <p className="text-lg mb-4">The provider you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/services">Browse All Services</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">{provider.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="h-4 w-4" />
              <span>{provider.location.address}, {provider.location.city}, {provider.location.state}</span>
              
              {provider.rating && (
                <>
                  <span className="mx-2">•</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{provider.rating.toFixed(1)}</span>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About This Provider</h2>
                  <p className="text-muted-foreground">
                    {provider.description || 'No description available for this provider.'}
                  </p>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Services Offered</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {provider.services && provider.services.length > 0 ? (
                        provider.services.map((service, idx) => (
                          <Badge key={idx} variant="secondary" className="px-3 py-1">
                            {service}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No services listed.</p>
                      )}
                    </div>
                  </div>
                </Card>
                
                <div className="mt-6">
                  <Button asChild size="lg" className="w-full md:w-auto">
                    <Link to={`/service-reservation/${provider.id}`}>
                      Book an Appointment
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Contact & Details</h2>
                  <div className="space-y-4">
                    {provider.phone && (
                      <div className="flex gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-muted-foreground">{provider.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">
                          {provider.location.address}, {provider.location.city}<br />
                          {provider.location.state} {provider.location.zipCode}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Car className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Service Types</p>
                        <p className="text-muted-foreground">
                          {provider.services && provider.services.length > 0 
                            ? provider.services.slice(0, 3).join(', ') + (provider.services.length > 3 ? '...' : '')
                            : 'No services listed.'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Availability</p>
                        <p className="text-muted-foreground">
                          {provider.available_today ? 'Available today' : 'By appointment only'}
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
