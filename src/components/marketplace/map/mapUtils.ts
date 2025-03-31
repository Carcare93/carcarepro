
// Map utility functions for Google Maps integration

// Default center (NYC)
export const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

// Google Maps container styles
export const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '0.75rem'
};

// Map styling options
export const mapOptions = {
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
};

// Start spinning the globe
export const setupGlobeSpinning = (mapRef: React.MutableRefObject<google.maps.Map | null>, isLoaded: boolean) => {
  if (!mapRef.current || !isLoaded) return;
  
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

  // Start the spinning animation
  spinGlobe();

  // Add event listeners to map
  const setupInteractionHandlers = () => {
    if (!mapRef.current) return;

    mapRef.current.addListener('dragstart', () => {
      userInteracting = true;
    });

    mapRef.current.addListener('dragend', () => {
      setTimeout(() => {
        userInteracting = false;
      }, 2000);
    });

    mapRef.current.addListener('click', () => {
      userInteracting = true;
      setTimeout(() => {
        userInteracting = false;
      }, 2000);
    });
  };

  setupInteractionHandlers();
};

// Fit map to provider locations
export const fitMapToBounds = (
  mapRef: React.MutableRefObject<google.maps.Map | null>, 
  providers: any[], 
  isLoaded: boolean
) => {
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
      return true;
    }
  }
  return false;
};
