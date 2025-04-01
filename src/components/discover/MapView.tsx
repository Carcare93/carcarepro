
import React, { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Map } from 'lucide-react';
import ApiKeyForm from '@/components/marketplace/map/ApiKeyForm';
import GoogleMapComponent from '@/components/marketplace/map/GoogleMapComponent';
import { defaultCenter } from '@/components/marketplace/map/mapUtils';
import { providers } from '@/components/discover/ProvidersData';
import { useToast } from '@/hooks/use-toast';
import { ServiceProvider } from '@/services/car-service';

const MapView = () => {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('googleMapsApiKey') || "";
  });

  // Convert the discover provider format to ServiceProvider format
  const mapProviders: ServiceProvider[] = providers.map(provider => ({
    id: provider.id,
    name: provider.name,
    location: {
      address: provider.location.address,
      city: provider.location.city,
      state: provider.location.state,
      zipCode: provider.location.zipCode,
      coordinates: provider.location.coordinates
    },
    services: provider.services,
    rating: provider.rating,
    reviewCount: provider.reviewCount,
    phone: "",  // Not available in the original data
    verified: provider.verified,
    available_today: provider.available_today
  }));

  // If we don't have an API key, show the form to enter one
  if (!apiKey) {
    return <ApiKeyForm apiKey={apiKey} setApiKey={setApiKey} />;
  }

  // Check if the API key is valid
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    preventGoogleFontsLoading: true,
  });

  // Show error if Google Maps API failed to load
  if (loadError) {
    return <ApiKeyForm apiKey={apiKey} setApiKey={setApiKey} loadError={loadError} />;
  }

  // If no API key, or API not loaded yet, show placeholder
  if (!isLoaded) {
    return (
      <div className="bg-secondary rounded-xl flex items-center justify-center h-[600px] mt-4">
        <div className="text-center">
          <Map className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location updated",
            description: "Map centered to your current location",
          });
        },
        () => {
          toast({
            variant: "destructive",
            title: "Location access denied",
            description: "Please enable location access to use this feature",
          });
        }
      );
    }
  };

  return (
    <GoogleMapComponent 
      apiKey={apiKey}
      center={center}
      providers={mapProviders}
      selectedProvider={selectedProvider}
      setSelectedProvider={setSelectedProvider}
      handleUseCurrentLocation={handleUseCurrentLocation}
      viewAllProviders={() => {}}
      onChangeApiKey={() => setApiKey("")}
    />
  );
};

export default MapView;
