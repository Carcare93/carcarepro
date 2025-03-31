
import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { ServiceProvider } from '@/services/car-service';

interface ProviderInfoWindowProps {
  provider: ServiceProvider;
  onClose: () => void;
}

const ProviderInfoWindow: React.FC<ProviderInfoWindowProps> = ({ provider, onClose }) => {
  if (!provider.location?.coordinates) return null;
  
  return (
    <InfoWindow
      position={{
        lat: provider.location.coordinates.lat,
        lng: provider.location.coordinates.lng
      }}
      onCloseClick={onClose}
    >
      <div className="p-2 max-w-xs">
        <h3 className="font-medium text-base">{provider.name}</h3>
        <p className="text-sm mt-1">{provider.location.address}</p>
        <p className="text-sm">{provider.location.city}, {provider.location.state}</p>
        <div className="flex items-center text-sm mt-2">
          <span className="text-yellow-500 mr-1">★</span>
          <span>{provider.rating}</span>
          <span className="text-gray-500 ml-1">({provider.reviewCount} reviews)</span>
        </div>
        <Button 
          size="sm"
          className="w-full mt-3"
          onClick={() => provider.phone && window.open(`tel:${provider.phone}`, '_blank')}
        >
          Call Now
        </Button>
      </div>
    </InfoWindow>
  );
};

export default ProviderInfoWindow;
