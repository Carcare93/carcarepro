
import React from 'react';
import { MapIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ServiceProvider } from '@/services/car-service';

interface ServiceMapProps {
  providers: ServiceProvider[];
  isLoading: boolean;
}

const ServiceMap = ({ providers, isLoading }: ServiceMapProps) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[600px] rounded-xl" />;
  }

  return (
    <div>
      {/* Map placeholder - In a real app, this would be an actual map component */}
      <div className="bg-secondary rounded-xl flex items-center justify-center h-[600px] mt-4 relative overflow-hidden">
        <div className="text-center z-10">
          <MapIcon className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-xl font-medium mb-2">Map View</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            This is a placeholder for the interactive map. In a real application, this would display service providers on a map using a library like Google Maps or Mapbox.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline">
              Use Current Location
            </Button>
            <Button>
              View All Providers
            </Button>
          </div>
        </div>
        
        {/* Map decoration elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-primary rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-primary rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-primary rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-primary rounded-full"></div>
          
          {/* Map grid lines */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`v-${i}`} className="border-r border-primary/10 h-full"></div>
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`h-${i}`} className="border-b border-primary/10 w-full"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Provider list below map */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Nearby Service Providers ({providers.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <div key={provider.id} className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{provider.name}</h4>
                <div className="flex items-center text-sm">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{provider.rating}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {provider.location.address}, {provider.location.city}
              </p>
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                  View Details
                </Button>
                <span className="text-xs text-muted-foreground">
                  {/* In a real app, this would be the actual distance */}
                  ~2.3 miles away
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceMap;
