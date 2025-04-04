
import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star } from 'lucide-react';

interface FilterSidebarProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
}

const FilterSidebar = ({ isFilterOpen, setIsFilterOpen }: FilterSidebarProps) => {
  return (
    <div 
      className={`bg-white rounded-xl border border-border p-5 mb-6 md:mb-0 md:w-72 shrink-0 ${
        isFilterOpen ? 'block' : 'hidden md:block'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)} className="md:hidden">
          Close
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Search filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Keywords..." className="pl-9" />
          </div>
        </div>
        
        {/* Location filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="City or zip code..." className="pl-9" />
          </div>
        </div>
        
        {/* Distance filter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Distance</label>
            <span className="text-xs">10 miles</span>
          </div>
          <Slider defaultValue={[10]} max={50} step={1} />
        </div>
        
        {/* Service type filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Service Type</label>
          <div className="space-y-2">
            {['Oil Change', 'Tire Services', 'Brakes', 'Engine Repair', 'Diagnostics'].map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox id={service.toLowerCase().replace(' ', '-')} />
                <label
                  htmlFor={service.toLowerCase().replace(' ', '-')}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {service}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Availability filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Availability</label>
          <Select defaultValue="any">
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any time</SelectItem>
              <SelectItem value="today">Available today</SelectItem>
              <SelectItem value="tomorrow">Available tomorrow</SelectItem>
              <SelectItem value="week">Available this week</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Rating filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Rating</label>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox id={`rating-${rating}`} />
                <label
                  htmlFor={`rating-${rating}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  {Array.from({ length: 5 - rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gray-300" />
                  ))}
                  <span className="ml-1">& Up</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
