
import React from 'react';
import { Map } from 'lucide-react';

const MapView = () => (
  <div className="bg-secondary rounded-xl flex items-center justify-center h-[600px] mt-4">
    <div className="text-center">
      <Map className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
      <p className="text-muted-foreground">Map view will be implemented in the next phase.</p>
      <p className="text-sm text-muted-foreground mt-2">Integration with Google Maps API is planned.</p>
    </div>
  </div>
);

export default MapView;
