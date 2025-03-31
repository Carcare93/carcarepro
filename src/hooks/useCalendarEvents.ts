
import { useState, useEffect } from 'react';
import { Booking, ServiceDuration } from '@/types/booking';
import { startOfDay, endOfDay, format, parseISO, addMinutes } from 'date-fns';
import { getServiceDuration, standardizeDuration } from '@/services/booking-service';

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  color: string;
  duration: ServiceDuration; // in minutes
  booking: Booking;
};

export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  serviceType: string;
  duration: ServiceDuration; // in minutes
  isAvailable: boolean;
};

// Sample time slots - in a real app, this would come from the database
const defaultTimeSlots: TimeSlot[] = [
  {
    id: '1',
    startTime: '09:00',
    endTime: '09:30',
    dayOfWeek: 1, // Monday
    serviceType: 'Oil Change',
    duration: 30,
    isAvailable: true
  },
  {
    id: '2',
    startTime: '09:30',
    endTime: '10:00',
    dayOfWeek: 1, // Monday
    serviceType: 'Oil Change',
    duration: 30,
    isAvailable: true
  },
  {
    id: '3',
    startTime: '10:00',
    endTime: '11:00',
    dayOfWeek: 1, // Monday
    serviceType: 'Tire Rotation',
    duration: 60,
    isAvailable: true
  },
  {
    id: '4',
    startTime: '09:00',
    endTime: '09:30',
    dayOfWeek: 2, // Tuesday
    serviceType: 'Oil Change',
    duration: 30,
    isAvailable: true
  },
  {
    id: '5',
    startTime: '09:30',
    endTime: '10:30',
    dayOfWeek: 2, // Tuesday
    serviceType: 'Brake Inspection',
    duration: 60,
    isAvailable: true
  },
  {
    id: '6',
    startTime: '09:00',
    endTime: '09:30',
    dayOfWeek: 3, // Wednesday
    serviceType: 'Oil Change',
    duration: 30,
    isAvailable: true
  },
  {
    id: '7',
    startTime: '10:00',
    endTime: '11:30',
    dayOfWeek: 3, // Wednesday
    serviceType: 'Full Inspection',
    duration: 90,
    isAvailable: true
  }
];

// Map service types to colors
const serviceColorMap: Record<string, string> = {
  'Oil Change': '#E5DEFF', // Soft Purple
  'Tire Rotation': '#FDE1D3', // Soft Peach
  'Brake Inspection': '#FEF7CD', // Soft Yellow
  'Full Inspection': '#D3E4FD', // Soft Blue
  'Scheduled Maintenance': '#F2FCE2', // Soft Green
  'Tire Replacement': '#FEC6A1', // Soft Orange
  'Brake Repair': '#FFDEE2', // Soft Pink
  'default': '#E5DEFF' // Default color
};

export const useCalendarEvents = (bookings: Booking[], currentDate: Date) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>(defaultTimeSlots);

  useEffect(() => {
    // Convert bookings to calendar events
    const mappedEvents = bookings.map(booking => {
      const serviceType = booking.serviceType.split('(')[0].trim();
      const color = serviceColorMap[serviceType] || serviceColorMap.default;
      
      // Use booking duration if available, otherwise calculate it and standardize
      let duration = booking.duration;
      if (!duration) {
        duration = getServiceDuration(booking.serviceType);
      } else {
        // Ensure duration is one of the standard options
        duration = standardizeDuration(duration);
      }
      
      return {
        id: booking.id,
        title: booking.serviceType,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        color,
        duration,
        booking
      };
    });

    // Update available time slots based on bookings
    const updatedTimeSlots = [...availableTimeSlots];
    
    // In a real app, this would check for time slot conflicts and mark slots as unavailable
    // For now, we'll just mark a few as unavailable
    mappedEvents.forEach(event => {
      if (event.status === 'confirmed' || event.status === 'pending') {
        const eventDate = new Date(event.date);
        const dayOfWeek = eventDate.getDay();
        
        // Mark time slots as unavailable if they overlap with the booking
        updatedTimeSlots.forEach((slot, index) => {
          if (slot.dayOfWeek === dayOfWeek && slot.startTime === event.time) {
            updatedTimeSlots[index] = { ...slot, isAvailable: false };
          }
        });
      }
    });

    setEvents(mappedEvents);
    setAvailableTimeSlots(updatedTimeSlots);
  }, [bookings]);

  return {
    events,
    availableTimeSlots,
    setAvailableTimeSlots
  };
};
