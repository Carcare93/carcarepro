import { Booking, BookingStatus, ServiceDuration } from '@/types/booking';
import { v4 as uuidv4 } from 'uuid';
import { authService, User } from './auth-service';

// Map of service types to their durations in minutes
export const serviceDurations: Record<string, ServiceDuration> = {
  'Oil Change & Filter Replacement': 45,
  'Scheduled Maintenance': 120,
  'Tire Rotation & Balancing': 60,
  'Brake Inspection & Repair': 90,
  'Oil Change': 30,
  'Tire Rotation': 30,
  'Brake Inspection': 60,
  'Full Inspection': 90,
  'Tire Replacement': 60,
  'Scheduled Maintenance (30,000 miles)': 120,
  // Default duration if service type not found
  'default': 60
};

// Standard duration options for services
export const standardDurations: ServiceDuration[] = [15, 30, 45, 60, 90, 120];

// Function to get the standardized duration for a specific service type
export const getServiceDuration = (serviceType: string): ServiceDuration => {
  // Remove anything in parentheses for matching
  const baseServiceType = serviceType.split('(')[0].trim();
  
  // Try to find an exact match first
  if (serviceDurations[serviceType]) {
    return serviceDurations[serviceType];
  }
  
  // Then try the base service type
  if (serviceDurations[baseServiceType]) {
    return serviceDurations[baseServiceType];
  }
  
  // Fall back to default duration
  return serviceDurations.default;
};

// Function to standardize a duration value to one of the standard options
export const standardizeDuration = (duration: number): ServiceDuration => {
  // Find the closest standard duration
  return standardDurations.reduce((prev, curr) => {
    return Math.abs(curr - duration) < Math.abs(prev - duration) ? curr : prev;
  }, standardDurations[0]);
};

// Function to register a new service with duration
export const registerServiceWithDuration = (
  serviceName: string, 
  duration: ServiceDuration
): void => {
  // In a real app, this would update a database
  serviceDurations[serviceName] = duration;
  
  // For now, just update the in-memory map
  console.log(`Registered service "${serviceName}" with duration ${duration} minutes`);
};

// Function to generate mock bookings data
export const fetchMockBookings = async (): Promise<Booking[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if current user is a provider to return provider-specific bookings
  const currentUser = authService.getCurrentUser();
  const isProvider = currentUser?.accountType === 'provider';
  
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
      notes: 'Used synthetic oil as requested.',
      duration: 45 // Add duration in minutes
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
      notes: 'Customer cancelled due to scheduling conflict.',
      duration: 120 // Add duration in minutes
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
      price: 79.99,
      duration: 60 // Add duration in minutes
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
      notes: 'Customer reported squeaking when braking.',
      duration: 90 // Add duration in minutes
    }
  ];
};

// Function to mock booking appointment (in real app this would call an API)
export const bookAppointment = async (bookingData: Omit<Booking, 'id'>): Promise<Booking> => {
  // Calculate duration if not provided and ensure it's standardized
  const rawDuration = bookingData.duration || getServiceDuration(bookingData.serviceType);
  const duration = standardizeDuration(rawDuration);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mocked response with generated ID and standardized duration
  return {
    id: uuidv4(),
    ...bookingData,
    duration
  };
};

// Functions for provider operations
export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<Booking> => {
  // This would call an API endpoint in a real application
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock implementation - in a real app, this would update the booking in the database
  const bookings = await fetchMockBookings();
  const booking = bookings.find(b => b.id === bookingId);
  
  if (!booking) {
    throw new Error('Booking not found');
  }
  
  // In a real app, we would verify the provider is authorized to update this booking
  booking.status = status;
  
  return booking;
};

class BookingService {
  async getProviderBookings(): Promise<Booking[]> {
    // In a real app, this would fetch bookings for the current provider
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser || currentUser.accountType !== 'provider') {
      throw new Error('Not authenticated as a provider');
    }
    
    // For now, we'll just return the mock bookings
    return fetchMockBookings();
  }
  
  async acceptBooking(bookingId: string): Promise<Booking> {
    return updateBookingStatus(bookingId, 'confirmed');
  }
  
  async declineBooking(bookingId: string): Promise<Booking> {
    return updateBookingStatus(bookingId, 'cancelled');
  }
  
  async completeBooking(bookingId: string): Promise<Booking> {
    return updateBookingStatus(bookingId, 'completed');
  }
}

export const bookingService = new BookingService();
