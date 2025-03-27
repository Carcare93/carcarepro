
import { Vehicle, ServiceProvider } from '@/services/car-service';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

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
}
