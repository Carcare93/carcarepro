
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Calendar as CalendarDayIcon, 
  Layers 
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from 'date-fns';
import DailyView from './calendar/DailyView';
import WeeklyView from './calendar/WeeklyView';
import MonthlyView from './calendar/MonthlyView';
import { Booking } from '@/types/booking';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import TimeSlotManagementModal from './calendar/TimeSlotManagementModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type CalendarViewProps = {
  bookings: Booking[];
  isLoading: boolean;
  onAcceptBooking: (bookingId: string) => Promise<void>;
  onDeclineBooking: (bookingId: string) => Promise<void>;
  onCompleteBooking: (bookingId: string) => Promise<void>;
};

const CalendarView = ({ 
  bookings, 
  isLoading, 
  onAcceptBooking, 
  onDeclineBooking, 
  onCompleteBooking 
}: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
  const { events, availableTimeSlots } = useCalendarEvents(bookings, selectedDate);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 })
  });
  
  const handlePreviousWeek = () => {
    setWeekStart(subWeeks(weekStart, 1));
  };
  
  const handleNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };
  
  const handleViewChange = (newView: 'day' | 'week' | 'month') => {
    setView(newView);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold">Calendar &amp; Appointments</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsTimeSlotModalOpen(true)}
            >
              <Clock className="h-4 w-4 mr-2" />
              Manage Time Slots
            </Button>
            
            <Select
              value={view}
              onValueChange={(value) => handleViewChange(value as 'day' | 'week' | 'month')}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          {view === 'day' && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSelectedDate(addDays(selectedDate, -1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[240px] justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {view === 'week' && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePreviousWeek}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" className="min-w-[240px] justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(weekStart, 'MMM d')} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNextWeek}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {view === 'month' && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSelectedDate(addDays(selectedDate, -30))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" className="min-w-[160px] justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'MMMM yyyy')}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSelectedDate(addDays(selectedDate, 30))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-0">
        {isLoading ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">Loading calendar data...</p>
          </div>
        ) : (
          <div>
            {view === 'day' && (
              <DailyView 
                selectedDate={selectedDate} 
                events={events.filter(event => 
                  isSameDay(new Date(event.date), selectedDate)
                )}
                availableTimeSlots={availableTimeSlots}
                onAcceptBooking={onAcceptBooking}
                onDeclineBooking={onDeclineBooking}
                onCompleteBooking={onCompleteBooking}
              />
            )}
            
            {view === 'week' && (
              <WeeklyView 
                weekStart={weekStart}
                events={events}
                availableTimeSlots={availableTimeSlots}
                onAcceptBooking={onAcceptBooking}
                onDeclineBooking={onDeclineBooking}
                onCompleteBooking={onCompleteBooking}
              />
            )}
            
            {view === 'month' && (
              <MonthlyView 
                selectedDate={selectedDate} 
                events={events}
                onAcceptBooking={onAcceptBooking}
                onDeclineBooking={onDeclineBooking}
                onCompleteBooking={onCompleteBooking}
              />
            )}
          </div>
        )}
      </div>
      
      <TimeSlotManagementModal 
        isOpen={isTimeSlotModalOpen} 
        onClose={() => setIsTimeSlotModalOpen(false)} 
      />
    </div>
  );
};

export default CalendarView;
