
import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterSidebarProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  filters: {
    service: string;
    rating: number;
    distance: number;
    open: boolean;
    verified: boolean;
  };
  onFilterChange: (filters: FilterSidebarProps['filters']) => void;
}

const FilterSidebar = ({ 
  isFilterOpen, 
  setIsFilterOpen,
  filters,
  onFilterChange
}: FilterSidebarProps) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Common service types
  const serviceTypes = [
    'Oil Change',
    'Brake Service',
    'Tire Replacement',
    'Engine Repair',
    'Transmission Service',
    'Battery Service',
    'AC Repair',
    'Diagnostics'
  ];

  useEffect(() => {
    // Update local state when parent filters change
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof typeof localFilters, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      service: '',
      rating: 0,
      distance: 50,
      open: false,
      verified: false
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{t('filters.title', 'Filters')}</h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="text-sm"
          >
            {t('filters.reset', 'Reset')}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsFilterOpen(false)}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Service type filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">{t('filters.serviceType', 'Service Type')}</label>
          <Select 
            value={localFilters.service}
            onValueChange={(value) => handleFilterChange('service', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('filters.selectService', 'Select service')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('filters.all', 'All Services')}</SelectItem>
              {serviceTypes.map((service) => (
                <SelectItem key={service} value={service}>{service}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Rating filter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">{t('filters.minimumRating', 'Minimum Rating')}</label>
            <span className="text-sm">{localFilters.rating} ★</span>
          </div>
          <Slider 
            min={0}
            max={5}
            step={0.5}
            value={[localFilters.rating]}
            onValueChange={(value) => handleFilterChange('rating', value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{t('filters.any', 'Any')}</span>
            <span>5 ★</span>
          </div>
        </div>
        
        {/* Distance filter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">{t('filters.maxDistance', 'Maximum Distance')}</label>
            <span className="text-sm">{localFilters.distance} {t('common.miles', 'miles')}</span>
          </div>
          <Slider 
            min={1}
            max={100}
            step={1}
            value={[localFilters.distance]}
            onValueChange={(value) => handleFilterChange('distance', value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 {t('common.mile', 'mile')}</span>
            <span>100 {t('common.miles', 'miles')}</span>
          </div>
        </div>
        
        {/* Availability filter */}
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="available" 
              checked={localFilters.open}
              onCheckedChange={(checked) => handleFilterChange('open', !!checked)}
            />
            <Label htmlFor="available" className="text-sm">
              {t('filters.availableToday', 'Available Today')}
            </Label>
          </div>
        </div>
        
        {/* Verified filter */}
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="verified" 
              checked={localFilters.verified}
              onCheckedChange={(checked) => handleFilterChange('verified', !!checked)}
            />
            <Label htmlFor="verified" className="text-sm">
              {t('filters.verifiedOnly', 'Verified Providers Only')}
            </Label>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => onFilterChange(localFilters)}
        >
          {t('filters.apply', 'Apply Filters')}
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
