
import { Booking } from '@/types/booking';
import { v4 as uuidv4 } from 'uuid';

// Function to generate mock bookings data
export const fetchMockBookings = async (): Promise<Booking[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: uuidv4(),
      serviceType: 'Oil Change & Filter Replacement',
      date: '2023-07-15',
      time: '10:30 AM',
      status: 'completed',
      provider: {
        id: '1',
        name: 'Express Auto Service',
        location: {
          address: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94107',
          coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        services: ['oil change', 'filters', 'tire rotation'],
        rating: 4.7,
        reviewCount: 243,
        phone: '(415) 555-1234'
      },
      vehicle: {
        id: '1',
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        licensePlate: 'ABC123'
      },
      price: 89.99,
      notes: 'Used synthetic oil as requested.'
    },
    {
      id: uuidv4(),
      serviceType: 'Scheduled Maintenance (30,000 miles)',
      date: '2023-10-22',
      time: '09:15 AM',
      status: 'cancelled',
      provider: {
        id: '2',
        name: 'AutoCare Plus',
        location: {
          address: '456 Market St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          coordinates: { lat: 37.7897, lng: -122.4000 }
        },
        services: ['maintenance', 'diagnostics', 'repairs'],
        rating: 4.5,
        reviewCount: 189,
        phone: '(415) 555-6789'
      },
      vehicle: {
        id: '1',
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        licensePlate: 'ABC123'
      },
      price: 349.99,
      notes: 'Customer cancelled due to scheduling conflict.'
    },
    {
      id: uuidv4(),
      serviceType: 'Tire Rotation & Balancing',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
      time: '02:00 PM',
      status: 'confirmed',
      provider: {
        id: '3',
        name: 'Precision Tire & Auto',
        location: {
          address: '789 Valencia St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94110',
          coordinates: { lat: 37.7618, lng: -122.4216 }
        },
        services: ['tires', 'wheel alignment', 'balancing'],
        rating: 4.8,
        reviewCount: 312,
        phone: '(415) 555-4321'
      },
      vehicle: {
        id: '2',
        make: 'Honda',
        model: 'Accord',
        year: 2020,
        licensePlate: 'XYZ789'
      },
      price: 79.99
    },
    {
      id: uuidv4(),
      serviceType: 'Brake Inspection & Repair',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      time: '11:45 AM',
      status: 'pending',
      provider: {
        id: '4',
        name: 'Master Mechanics',
        location: {
          address: '1010 Bryant St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          coordinates: { lat: 37.7752, lng: -122.4095 }
        },
        services: ['brakes', 'suspension', 'steering'],
        rating: 4.6,
        reviewCount: 178,
        phone: '(415) 555-8765'
      },
      vehicle: {
        id: '2',
        make: 'Honda',
        model: 'Accord',
        year: 2020,
        licensePlate: 'XYZ789'
      },
      price: 149.99,
      notes: 'Customer reported squeaking when braking.'
    }
  ];
};

// Function to mock booking appointment (in real app this would call an API)
export const bookAppointment = async (bookingData: Omit<Booking, 'id'>): Promise<Booking> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mocked response with generated ID
  return {
    id: uuidv4(),
    ...bookingData
  };
};
