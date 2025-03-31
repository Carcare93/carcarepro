
import React from 'react';
import { format, parse, addMinutes } from 'date-fns';
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

type DailyViewProps = {
  selectedDate: Date;
  events: CalendarEvent[];
  availableTimeSlots: TimeSlot[];
  onAcceptBooking: (bookingId: string) => Promise<void>;
  onDeclineBooking: (bookingId: string) => Promise<void>;
  onCompleteBooking: (bookingId: string) => Promise<void>;
};

// Generate time slots for the day view (30-minute intervals)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

const DailyView = ({ 
  selectedDate, 
  events, 
  availableTimeSlots,
  onAcceptBooking,
  onDeclineBooking,
  onCompleteBooking
}: DailyViewProps) => {
  const timeSlots = generateTimeSlots();
  
  // Get day of week to filter available time slots
  const dayOfWeek = selectedDate.getDay();
  
  return (
    <div className="px-6 pb-6">
      <div className="grid grid-cols-1 gap-4">
        {timeSlots.map((time) => {
          const eventsAtTime = events.filter(event => {
            const eventTime = event.time;
            return eventTime === time;
          });
          
          const availableSlot = availableTimeSlots.find(slot => 
            slot.startTime === time && slot.dayOfWeek === dayOfWeek
          );
          
          return (
            <div key={time} className="group flex items-start gap-4 py-2 border-t border-border">
              <div className="w-16 pt-1 text-sm text-muted-foreground flex-shrink-0">
                {time}
              </div>
              
              <div className="flex-grow">
                {eventsAtTime.length > 0 ? (
                  <div className="space-y-2">
                    {eventsAtTime.map(event => (
                      <Card key={event.id} 
                        className="overflow-hidden"
                        style={{ borderLeft: `4px solid ${event.color}` }}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {time} - {format(
                                  addMinutes(
                                    parse(time, 'HH:mm', new Date()), 
                                    event.duration
                                  ),
                                  'HH:mm'
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookingStatusBadge status={event.status} />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
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
                          
                          <div className="mt-2">
                            <p className="text-sm">
                              {event.booking.vehicle.year} {event.booking.vehicle.make} {event.booking.vehicle.model}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : availableSlot ? (
                  <div 
                    className="h-12 rounded-md border border-dashed border-border bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/40 transition-colors"
                  >
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-2" />
                      Available: {availableSlot.serviceType} ({availableSlot.duration} min)
                    </p>
                  </div>
                ) : (
                  <div className="h-12 rounded-md border-transparent"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyView;
