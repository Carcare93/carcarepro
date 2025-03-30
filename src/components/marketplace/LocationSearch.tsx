
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LocationSearchProps {
  location: string;
  setLocation: (location: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const LocationSearch = ({ location, setLocation, handleSearch }: LocationSearchProps) => {
  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-grow">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Enter your location..." 
          className="pl-9 pr-4 py-2" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
};

export default LocationSearch;
