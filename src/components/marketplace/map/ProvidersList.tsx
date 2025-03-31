
import React from 'react';
import { ServiceProvider } from '@/services/car-service';
import { Button } from '@/components/ui/button';

interface ProvidersListProps {
  providers: ServiceProvider[];
  onProviderClick: (provider: ServiceProvider) => void;
}

const ProvidersList: React.FC<ProvidersListProps> = ({ providers, onProviderClick }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Nearby Service Providers ({providers.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <div 
            key={provider.id} 
            className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
            onClick={() => onProviderClick(provider)}
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
                {provider.location?.coordinates ? "~2.3 miles away" : "Distance unknown"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvidersList;
