
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface FilterSidebarProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
}

const FilterSidebar = ({ isFilterOpen, setIsFilterOpen }: FilterSidebarProps) => {
  const { t } = useTranslation();
  
  return (
    <div 
      className={`bg-white rounded-xl border border-border p-5 mb-6 md:mb-0 md:w-72 shrink-0 ${
        isFilterOpen ? 'block' : 'hidden md:block'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{t('filters.title')}</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)} className="md:hidden">
          {t('common.close')}
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Service type filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">{t('filters.serviceType')}</label>
          <div className="space-y-2">
            {[
              { key: 'oilChange', label: t('filters.serviceTypes.oilChange') },
              { key: 'tireServices', label: t('filters.serviceTypes.tireServices') },
              { key: 'brakes', label: t('filters.serviceTypes.brakes') },
              { key: 'engineRepair', label: t('filters.serviceTypes.engineRepair') },
              { key: 'diagnostics', label: t('filters.serviceTypes.diagnostics') }
            ].map((service) => (
              <div key={service.key} className="flex items-center space-x-2">
                <Checkbox id={service.key} />
                <label
                  htmlFor={service.key}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {service.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Distance filter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">{t('filters.distance')}</label>
            <span className="text-xs">10 miles</span>
          </div>
          <Slider defaultValue={[10]} max={50} step={1} />
        </div>
        
        {/* Rating filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">{t('filters.rating')}</label>
          <Select defaultValue="4">
            <SelectTrigger>
              <SelectValue placeholder={t('filters.minRating')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">{t('filters.ratingOptions.fiveStars')}</SelectItem>
              <SelectItem value="4">{t('filters.ratingOptions.fourStars')}</SelectItem>
              <SelectItem value="3">{t('filters.ratingOptions.threeStars')}</SelectItem>
              <SelectItem value="2">{t('filters.ratingOptions.twoStars')}</SelectItem>
              <SelectItem value="1">{t('filters.ratingOptions.oneStar')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Availability filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">{t('filters.availability')}</label>
          <Select defaultValue="any">
            <SelectTrigger>
              <SelectValue placeholder={t('filters.availability')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t('filters.availabilityOptions.anyTime')}</SelectItem>
              <SelectItem value="today">{t('filters.availabilityOptions.today')}</SelectItem>
              <SelectItem value="tomorrow">{t('filters.availabilityOptions.tomorrow')}</SelectItem>
              <SelectItem value="week">{t('filters.availabilityOptions.week')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="w-full">{t('common.apply')}</Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
