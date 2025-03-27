
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookingStatus } from '@/types/booking';

interface BookingFiltersProps {
  currentFilter: BookingStatus | 'all';
  onFilterChange: (status: BookingStatus | 'all') => void;
}

const BookingFilters = ({ currentFilter, onFilterChange }: BookingFiltersProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
          {currentFilter !== 'all' && (
            <span className="ml-1 h-2 w-2 rounded-full bg-primary"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={currentFilter} onValueChange={(value) => onFilterChange(value as BookingStatus | 'all')}>
          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="confirmed">Confirmed</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="cancelled">Cancelled</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookingFilters;
