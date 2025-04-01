
import React from 'react';
import { Star, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Provider {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  services: string[];
  availability: string[];
  verified: boolean;
  available_today: boolean;
}

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard = ({ provider }: ProviderCardProps) => (
  <div className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all group animate-fade-in">
    <div className="flex flex-col md:flex-row">
      <div className="relative md:w-1/3 h-48 md:h-auto overflow-hidden">
        <img 
          src={provider.image} 
          alt={provider.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {provider.verified && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <Star className="h-3 w-3 mr-1 fill-white" />
            Verified
          </div>
        )}
        {provider.available_today && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Available Today
          </div>
        )}
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
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {provider.location.address}, {provider.location.city}, {provider.location.state} {provider.location.zipCode}
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Services:</p>
          <div className="flex flex-wrap gap-2">
            {provider.services.slice(0, 4).map((service, idx) => (
              <span 
                key={idx} 
                className="text-xs bg-secondary px-2 py-1 rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm">
            <span className="font-medium">Available:</span>{' '}
            {provider.availability.join(', ')}
          </div>
          <Button>
            Book Now
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default ProviderCard;
