
import { Vehicle, ServiceProvider } from '@/services/car-service';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// Standard duration options in minutes
export type ServiceDuration = 15 | 30 | 45 | 60 | 90 | 120;

export interface Booking {
  id: string;
  serviceType: string;
  date: string;
  time: string;
  status: BookingStatus;
  provider: ServiceProvider;
  vehicle: Vehicle;
  price?: number;
  notes?: string;
  duration?: ServiceDuration; // Duration in minutes
}
