
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapIcon, Navigation } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ServiceProvider } from '@/services/car-service';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

// Google Maps container styles
const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '0.75rem'
};

// Default center (NYC)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

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
  
  // Use the useJsApiLoader hook to load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    // Prevent the hook from loading if we don't have an API key yet
    preventGoogleFontsLoading: true,
  });

  useEffect(() => {
    // Start spinning the globe when map is loaded
    if (isLoaded && mapRef.current) {
      spinGlobe();
    }
  }, [isLoaded]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleProviderClick = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
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
    if (mapRef.current && providers.length > 0 && isLoaded) {
      const bounds = new google.maps.LatLngBounds();
      
      // Add all provider locations to bounds
      providers.forEach(provider => {
        if (provider.location?.coordinates?.lat && provider.location?.coordinates?.lng) {
          bounds.extend(new google.maps.LatLng(
            provider.location.coordinates.lat,
            provider.location.coordinates.lng
          ));
        }
      });
      
      // Only adjust bounds if we have valid providers
      if (!bounds.isEmpty()) {
        // Fit map to these bounds
        mapRef.current.fitBounds(bounds);
        
        toast({
          title: "View updated",
          description: "Showing all service providers on map",
        });
      }
    }
  };

  const saveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      localStorage.setItem('googleMapsApiKey', apiKey);
      toast({
        title: "API Key Saved",
        description: "Your Google Maps API key has been saved for this session.",
      });
      // Force re-render to load the map
      window.location.reload();
    }
  };
  
  // Implement globe spinning functionality
  let userInteracting = false;
  const spinGlobe = () => {
    if (!mapRef.current || !isLoaded) return;
    
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    
    const zoom = mapRef.current.getZoom();
    if (!userInteracting && zoom !== undefined && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = mapRef.current.getCenter();
      if (center) {
        const newLng = center.lng() - distancePerSecond;
        const newCenter = new google.maps.LatLng(center.lat(), newLng);
        mapRef.current.panTo(newCenter);
      }
    }
    // Continue spinning every second
    setTimeout(spinGlobe, 1000);
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[600px] rounded-xl" />;
  }

  // Show error message if Google Maps API failed to load
  if (loadError) {
    return (
      <div className="bg-secondary rounded-xl flex items-center justify-center h-[600px] mt-4 relative overflow-hidden">
        <div className="text-center z-10 max-w-md mx-auto p-6">
          <MapIcon className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-xl font-medium mb-2">Google Maps Loading Error</h3>
          <p className="text-muted-foreground mb-6">
            {loadError.message || "There was an error loading Google Maps. Please check your API key and try again."}
          </p>
          <form onSubmit={saveApiKey} className="space-y-4">
            <Input 
              type="text" 
              placeholder="Enter your Google Maps API Key" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full">Update API Key</Button>
          </form>
        </div>
      </div>
    );
  }

  // Show API key input if no key is available
  if (!apiKey) {
    return (
      <div className="bg-secondary rounded-xl flex items-center justify-center h-[600px] mt-4 relative overflow-hidden">
        <div className="text-center z-10 max-w-md mx-auto p-6">
          <MapIcon className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-xl font-medium mb-2">Google Maps API Key Required</h3>
          <p className="text-muted-foreground mb-6">
            To use the interactive map, you need to add your Google Maps API key:
          </p>
          <form onSubmit={saveApiKey} className="space-y-4">
            <Input 
              type="text" 
              placeholder="Enter your Google Maps API Key" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full">Save API Key</Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">
            Get your API key from the <a href="https://console.cloud.google.com/google/maps-apis" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-xl overflow-hidden mt-4 relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onLoad={onMapLoad}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControl: true,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }]
                }
              ]
            }}
            onClick={() => {
              userInteracting = true;
              setTimeout(() => {
                userInteracting = false;
              }, 2000);
            }}
            onDragStart={() => {
              userInteracting = true;
            }}
            onDragEnd={() => {
              setTimeout(() => {
                userInteracting = false;
              }, 2000);
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
                    onClick={() => handleProviderClick(provider)}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      scaledSize: new google.maps.Size(40, 40)
                    }}
                  />
                );
              }
              return null;
            })}

            {selectedProvider && selectedProvider.location?.coordinates && (
              <InfoWindow
                position={{
                  lat: selectedProvider.location.coordinates.lat,
                  lng: selectedProvider.location.coordinates.lng
                }}
                onCloseClick={() => setSelectedProvider(null)}
              >
                <div className="p-2 max-w-xs">
                  <h3 className="font-medium text-base">{selectedProvider.name}</h3>
                  <p className="text-sm mt-1">{selectedProvider.location.address}</p>
                  <p className="text-sm">{selectedProvider.location.city}, {selectedProvider.location.state}</p>
                  <div className="flex items-center text-sm mt-2">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{selectedProvider.rating}</span>
                    <span className="text-gray-500 ml-1">({selectedProvider.reviewCount} reviews)</span>
                  </div>
                  <Button 
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => selectedProvider.phone && window.open(`tel:${selectedProvider.phone}`, '_blank')}
                  >
                    Call Now
                  </Button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-[600px] rounded-xl bg-secondary flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {isLoaded && (
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex items-center gap-2 shadow-md"
              onClick={handleUseCurrentLocation}
            >
              <Navigation className="h-4 w-4" />
              <span className="hidden sm:inline">Use My Location</span>
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="shadow-md"
              onClick={viewAllProviders}
            >
              View All
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="shadow-md"
              onClick={() => setApiKey("")}
            >
              Change API Key
            </Button>
          </div>
        )}
      </div>
      
      {/* Provider list below map */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Nearby Service Providers ({providers.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <div 
              key={provider.id} 
              className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => {
                handleProviderClick(provider);
                // Center map on this provider only if coordinates exist
                if (mapRef.current && isLoaded && provider.location?.coordinates?.lat && provider.location?.coordinates?.lng) {
                  mapRef.current.panTo({
                    lat: provider.location.coordinates.lat,
                    lng: provider.location.coordinates.lng
                  });
                  mapRef.current.setZoom(15);
                }
              }}
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{provider.name}</h4>
                <div className="flex items-center text-sm">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{provider.rating}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {provider.location?.address}, {provider.location?.city}
              </p>
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                  View Details
                </Button>
                <span className="text-xs text-muted-foreground">
                  {/* In a real app, this would calculate the actual distance */}
                  {provider.location?.coordinates ? "~2.3 miles away" : "Distance unknown"}
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
