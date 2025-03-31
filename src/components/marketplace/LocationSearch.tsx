
import React, { FormEvent } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface LocationSearchProps {
  location: string;
  setLocation: (location: string) => void;
  handleSearch: (e: FormEvent) => void;
}

const LocationSearch = ({ location, setLocation, handleSearch }: LocationSearchProps) => {
  const { t } = useTranslation();
  
  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-grow">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={t('common.location')}
          className="pl-9 pr-4 py-2" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <Button type="submit">{t('common.search')}</Button>
    </form>
  );
};

export default LocationSearch;
