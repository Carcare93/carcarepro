
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Phone, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useServiceProviders } from '@/hooks/useServiceProviders';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const { toast } = useToast();
  const { providers, isLoading, error } = useServiceProviders('');
  
  // Show error message if providers couldn't be fetched
  React.useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading service providers",
        description: "Please try again later."
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-10">
        <h1 className="text-3xl font-bold mb-2">Our Services</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Connect with trusted auto service providers in your area.
        </p>
        
        {/* Service Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border rounded-lg hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Oil Change</h2>
              <p className="text-muted-foreground mb-4">Regular oil changes to keep your engine running smoothly.</p>
              <Badge variant="outline" className="bg-primary/10">Most Popular</Badge>
            </CardContent>
          </Card>
          <Card className="border rounded-lg hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Brake Service</h2>
              <p className="text-muted-foreground mb-4">Inspection and replacement of brake components for your safety.</p>
              <Badge variant="outline" className="bg-secondary/50">Essential</Badge>
            </CardContent>
          </Card>
          <Card className="border rounded-lg hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Tire Service</h2>
              <p className="text-muted-foreground mb-4">Rotation, replacement, and alignment for longer tire life.</p>
              <Badge variant="outline" className="bg-secondary/50">Recommended</Badge>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Service Providers</h2>
        
        {/* Loading state */}
        {isLoading && (
          <div className="space-y-6 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-border shadow-sm">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64 mb-2" />
                    <div className="space-y-4 mt-4">
                      <Skeleton className="h-4 w-32" />
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3].map((j) => (
                          <Skeleton key={j} className="h-6 w-20 rounded-full" />
                        ))}
                      </div>
                      <Skeleton className="h-10 w-32 mt-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Unable to load providers</h3>
            <p className="text-muted-foreground mb-4">
              We're having trouble loading service providers right now. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && !error && providers?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No service providers found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any service providers at the moment. Please check back later.
            </p>
            <Button asChild>
              <Link to="/provider-registration">Register as a Provider</Link>
            </Button>
          </div>
        )}
        
        {/* Service Providers List */}
        {!isLoading && !error && providers?.length > 0 && (
          <div className="space-y-6 mb-10">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-1/3 h-48 md:h-auto overflow-hidden">
                    {/* Provider image or placeholder */}
                    <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                      <Phone className="h-16 w-16 text-gray-300" />
                    </div>
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {provider.verified && (
                        <div className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </div>
                      )}
                      
                      {provider.available_today && (
                        <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Available Today
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold">{provider.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{provider.rating || 0}</span>
                        <span className="text-xs text-muted-foreground ml-1">({provider.review_count || 0})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {provider.location.address}, {provider.location.city}, {provider.location.state} {provider.location.zipCode}
                    </div>
                    
                    <div className="mt-4 mb-4">
                      <h4 className="text-sm font-medium mb-2">Available Services:</h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.services && provider.services.map((service, idx) => (
                          <Badge key={idx} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm">
                        <span className="font-medium">Available:</span>{' '}
                        {provider.available_today ? 'Today' : 'By appointment'}
                      </div>
                      <Button asChild>
                        <Link to={`/service-details/${provider.id}`}>Book Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/service-explorer">View All Service Providers</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
