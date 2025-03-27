
import React from 'react';
import { Star, MapPin, Phone, Car, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ServiceProvider } from '@/services/car-service';

interface ServiceListProps {
  providers: ServiceProvider[];
  isLoading: boolean;
}

const ServiceList = ({ providers, isLoading }: ServiceListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No service providers found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or location to find more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {providers.map((provider) => (
        <ServiceCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
};

const ServiceCard = ({ provider }: { provider: ServiceProvider }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all group animate-fade-in">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/3 h-48 md:h-auto overflow-hidden bg-gray-100">
          <div className="flex h-full items-center justify-center">
            <Car className="h-16 w-16 text-primary/30" />
          </div>
          <div className="absolute top-3 left-3 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </div>
        </div>
        
        <div className="p-6 md:w-2/3">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold">{provider.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-sm font-medium">{provider.rating}</span>
              <span className="text-xs text-muted-foreground ml-1">({provider.reviewCount})</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {provider.location.address}, {provider.location.city}, {provider.location.state} {provider.location.zipCode}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Phone className="h-4 w-4 mr-1" />
            {provider.phone}
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Services:</h4>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service, idx) => (
                <Badge key={idx} variant="secondary">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm">
              <span className="font-medium">Available:</span>{' '}
              Today, Tomorrow
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/service-details/${provider.id}`}>View Details</Link>
              </Button>
              <Button size="sm">Book Now</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-border">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/3 h-48 md:h-auto">
        <Skeleton className="h-full w-full" />
      </div>
      
      <div className="p-6 md:w-2/3">
        <div className="flex justify-between items-start mb-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-16" />
        </div>
        
        <Skeleton className="h-5 w-64 mb-2" />
        <Skeleton className="h-5 w-40 mb-4" />
        
        <Skeleton className="h-5 w-24 mb-2" />
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ServiceList;
