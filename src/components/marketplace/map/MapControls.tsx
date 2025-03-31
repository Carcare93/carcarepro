
import React from 'react';
import { Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MapControlsProps {
  handleUseCurrentLocation: () => void;
  viewAllProviders: () => void;
  onChangeApiKey: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  handleUseCurrentLocation,
  viewAllProviders,
  onChangeApiKey
}) => {
  return (
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
        onClick={onChangeApiKey}
      >
        Change API Key
      </Button>
    </div>
  );
};

export default MapControls;
