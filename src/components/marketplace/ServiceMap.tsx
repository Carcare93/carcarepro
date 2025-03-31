
import React, { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ServiceProvider } from '@/services/car-service';
import { defaultCenter, fitMapToBounds } from './map/mapUtils';
import ApiKeyForm from './map/ApiKeyForm';
import GoogleMapComponent from './map/GoogleMapComponent';
import ProvidersList from './map/ProvidersList';
import { Skeleton } from '@/components/ui/skeleton';

interface ServiceMapProps {
  providers: ServiceProvider[];
  isLoading: boolean;
}

const ServiceMap = ({ providers, isLoading }: ServiceMapProps) => {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [apiKey, setApiKey] = useState(() => {
    // Try to get from localStorage
    return localStorage.getItem('googleMapsApiKey') || "";
  });
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleProviderClick = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    
    // Center map on this provider only if coordinates exist
    if (mapRef.current && provider.location?.coordinates?.lat && provider.location?.coordinates?.lng) {
      mapRef.current.panTo({
        lat: provider.location.coordinates.lat,
        lng: provider.location.coordinates.lng
      });
      mapRef.current.setZoom(15);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(userLocation);
          toast({
            title: "Location updated",
            description: "Map centered to your current location",
          });
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Location access denied",
            description: "Please enable location access to use this feature",
          });
          console.error("Error getting user location:", error);
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
      });
    }
  };

  const viewAllProviders = () => {
    const success = fitMapToBounds(mapRef, providers, !!apiKey);
    
    if (success) {
      toast({
        title: "View updated",
        description: "Showing all service providers on map",
      });
    }
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[600px] rounded-xl" />;
  }

  // Show API key input if no key is available
  if (!apiKey) {
    return <ApiKeyForm apiKey={apiKey} setApiKey={setApiKey} />;
  }

  return (
    <div>
      <GoogleMapComponent 
        apiKey={apiKey}
        center={center}
        providers={providers}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
        handleUseCurrentLocation={handleUseCurrentLocation}
        viewAllProviders={viewAllProviders}
        onChangeApiKey={() => setApiKey("")}
        onMapLoad={onMapLoad}
      />
      
      {/* Provider list below map */}
      <ProvidersList 
        providers={providers} 
        onProviderClick={handleProviderClick} 
      />
    </div>
  );
};

export default ServiceMap;
