
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
        
        {/* Distance filter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Distance</label>
            <span className="text-xs">10 miles</span>
          </div>
          <Slider defaultValue={[10]} max={50} step={1} />
        </div>
        
        {/* Rating filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Rating</label>
          <Select defaultValue="4">
            <SelectTrigger>
              <SelectValue placeholder="Minimum Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Stars & Up</SelectItem>
              <SelectItem value="4">4 Stars & Up</SelectItem>
              <SelectItem value="3">3 Stars & Up</SelectItem>
              <SelectItem value="2">2 Stars & Up</SelectItem>
              <SelectItem value="1">1 Star & Up</SelectItem>
            </SelectContent>
          </Select>
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
        
        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
