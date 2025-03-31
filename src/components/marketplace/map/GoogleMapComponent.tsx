
import React, { useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { ServiceProvider } from '@/services/car-service';
import { containerStyle, mapOptions, setupGlobeSpinning } from './mapUtils';
import ProviderInfoWindow from './ProviderInfoWindow';
import MapControls from './MapControls';

interface GoogleMapComponentProps {
  apiKey: string;
  center: { lat: number; lng: number };
  providers: ServiceProvider[];
  selectedProvider: ServiceProvider | null;
  setSelectedProvider: (provider: ServiceProvider | null) => void;
  handleUseCurrentLocation: () => void;
  viewAllProviders: () => void;
  onChangeApiKey: () => void;
  onMapLoad?: (map: google.maps.Map) => void;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  apiKey,
  center,
  providers,
  selectedProvider,
  setSelectedProvider,
  handleUseCurrentLocation,
  viewAllProviders,
  onChangeApiKey,
  onMapLoad
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Use the useJsApiLoader hook to load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    preventGoogleFontsLoading: true,
  });

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (onMapLoad) onMapLoad(map);
  }, [onMapLoad]);

  useEffect(() => {
    // Start spinning the globe when map is loaded
    if (isLoaded && mapRef.current) {
      setupGlobeSpinning(mapRef, isLoaded);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] rounded-xl bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden mt-4 relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={handleMapLoad}
        options={mapOptions}
        onClick={() => {
          // User interaction event
        }}
      >
        {providers.map((provider) => {
          // Only show marker if provider has valid coordinates
          if (provider.location?.coordinates?.lat && provider.location?.coordinates?.lng) {
            return (
              <Marker
                key={provider.id}
                position={{
                  lat: provider.location.coordinates.lat,
                  lng: provider.location.coordinates.lng
                }}
                onClick={() => setSelectedProvider(provider)}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new google.maps.Size(40, 40)
                }}
              />
            );
          }
          return null;
        })}

        {selectedProvider && (
          <ProviderInfoWindow 
            provider={selectedProvider} 
            onClose={() => setSelectedProvider(null)} 
          />
        )}
      </GoogleMap>

      <MapControls 
        handleUseCurrentLocation={handleUseCurrentLocation}
        viewAllProviders={viewAllProviders}
        onChangeApiKey={onChangeApiKey}
      />
    </div>
  );
};

export default GoogleMapComponent;
