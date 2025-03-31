
import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isSameDay
} from 'date-fns';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type MonthlyViewProps = {
  selectedDate: Date;
  events: CalendarEvent[];
  onAcceptBooking: (bookingId: string) => Promise<void>;
  onDeclineBooking: (bookingId: string) => Promise<void>;
  onCompleteBooking: (bookingId: string) => Promise<void>;
};

const MonthlyView = ({ 
  selectedDate, 
  events,
  onAcceptBooking,
  onDeclineBooking,
  onCompleteBooking
}: MonthlyViewProps) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create array of 7 days for each week row
  const weeks = [];
  let week = [];
  
  // Add empty cells for days before the first of the month
  const firstDayOfMonth = monthStart.getDay();
  for (let i = 0; i < firstDayOfMonth; i++) {
    week.push(null);
  }
  
  // Add days of the month
  daysInMonth.forEach(day => {
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
  });
  
  // Add empty cells for days after the last of the month
  while (week.length < 7) {
    week.push(null);
  }
  weeks.push(week);
  
  return (
    <div className="bg-white">
      {/* Days of the week header */}
      <div className="grid grid-cols-7 text-center border-b border-border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 grid-rows-[repeat(6,minmax(100px,1fr))]">
        {weeks.flat().map((day, index) => {
          // Filter events for this day
          const dayEvents = day ? events.filter(event => 
            isSameDay(new Date(event.date), day)
          ) : [];
          
          return (
            <div 
              key={index} 
              className={`border border-border p-1 ${
                day && isToday(day) ? 'bg-primary/5' : 
                day && isSameMonth(day, selectedDate) ? 'bg-white' : 'bg-muted/30'
              }`}
            >
              {day && (
                <>
                  <div className="flex justify-between items-center">
                    <div 
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-sm ${
                        isToday(day) ? 'bg-primary text-primary-foreground' : ''
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                    {dayEvents.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            View All Events
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  <ScrollArea className="h-[calc(100%-28px)] mt-1">
                    <div className="space-y-1">
                      {dayEvents.slice(0, 4).map(event => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded-sm"
                          style={{ backgroundColor: event.color }}
                        >
                          <div className="font-medium truncate">{event.time}</div>
                          <div className="truncate">{event.title}</div>
                        </div>
                      ))}
                      {dayEvents.length > 4 && (
                        <div className="text-xs text-muted-foreground px-1">
                          +{dayEvents.length - 4} more
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyView;
