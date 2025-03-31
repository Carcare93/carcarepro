
import React from 'react';
import { format, isSameDay, addDays, eachDayOfInterval, endOfWeek, parse, addMinutes } from 'date-fns';
import { CalendarEvent, TimeSlot } from '@/hooks/useCalendarEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BookingStatusBadge from '@/components/bookings/BookingStatusBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Check, Clock, MoreVertical, X } from 'lucide-react';

type WeeklyViewProps = {
  weekStart: Date;
  events: CalendarEvent[];
  availableTimeSlots: TimeSlot[];
  onAcceptBooking: (bookingId: string) => Promise<void>;
  onDeclineBooking: (bookingId: string) => Promise<void>;
  onCompleteBooking: (bookingId: string) => Promise<void>;
};

// Generate time slots for the day view (hourly intervals for week view)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

const WeeklyView = ({
  weekStart,
  events,
  availableTimeSlots,
  onAcceptBooking,
  onDeclineBooking,
  onCompleteBooking
}: WeeklyViewProps) => {
  const timeSlots = generateTimeSlots();
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 })
  });

  const today = new Date();

  return (
    <div>
      {/* Week Header */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
        <div className="py-2 px-2 text-center text-muted-foreground"></div>
        {weekDays.map((day) => (
          <div 
            key={day.toString()} 
            className={`p-2 text-center border-l border-border ${
              isSameDay(day, today) ? 'bg-primary/10' : ''
            }`}
          >
            <p className="font-medium text-sm">{format(day, 'EEE')}</p>
            <p className={`text-sm ${
              isSameDay(day, today) ? 'text-primary font-bold' : 'text-muted-foreground'
            }`}>
              {format(day, 'd')}
            </p>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div>
        {timeSlots.map((timeSlot) => (
          <div key={timeSlot} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
            <div className="py-3 px-2 text-xs text-muted-foreground text-center">
              {timeSlot}
            </div>
            
            {weekDays.map((day, dayIndex) => {
              const eventsAtTimeOnDay = events.filter(event => {
                // Check if event is on this day and starts at this hour
                return isSameDay(new Date(event.date), day) && 
                       event.time.startsWith(timeSlot.split(':')[0]);
              });
              
              const dayOfWeek = day.getDay();
              const availableSlot = availableTimeSlots.find(slot => 
                slot.startTime.startsWith(timeSlot.split(':')[0]) && 
                slot.dayOfWeek === dayOfWeek
              );
              
              return (
                <div 
                  key={day.toString()} 
                  className={`min-h-[80px] p-1 border-l border-border ${
                    isSameDay(day, today) ? 'bg-primary/5' : ''
                  }`}
                >
                  {eventsAtTimeOnDay.length > 0 ? (
                    <div className="space-y-1">
                      {eventsAtTimeOnDay.map(event => (
                        <div
                          key={event.id}
                          className="p-1 rounded-sm text-xs"
                          style={{ backgroundColor: event.color }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium truncate">{event.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {event.time}
                              </p>
                            </div>
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {event.status === 'pending' && (
                                    <>
                                      <DropdownMenuItem onClick={() => onAcceptBooking(event.id)}>
                                        <Check className="h-4 w-4 mr-2" />
                                        Accept
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => onDeclineBooking(event.id)}>
                                        <X className="h-4 w-4 mr-2" />
                                        Decline
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {event.status === 'confirmed' && (
                                    <DropdownMenuItem onClick={() => onCompleteBooking(event.id)}>
                                      <Check className="h-4 w-4 mr-2" />
                                      Mark as Completed
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : availableSlot ? (
                    <div className="h-full rounded-sm border border-dashed border-border bg-secondary/10 flex items-center justify-center text-xs text-muted-foreground p-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {availableSlot.serviceType}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;
