
import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { startOfDay, endOfDay, format, parseISO, addMinutes } from 'date-fns';

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  color: string;
  duration: number; // in minutes
  booking: Booking;
};

export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  serviceType: string;
  duration: number; // in minutes
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
      
      // Determine duration based on service type
      let duration = 30; // default 30 minutes
      if (serviceType.includes('Inspection')) duration = 60;
      if (serviceType.includes('Replacement')) duration = 90;
      if (serviceType.includes('Maintenance')) duration = 120;
      
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

    setEvents(mappedEvents);
  }, [bookings]);

  return {
    events,
    availableTimeSlots,
    setAvailableTimeSlots
  };
};
