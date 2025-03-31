
/**
 * Type definitions for database tables
 */
export interface Booking {
  id: string;
  created_at?: string;
  status?: string;
  customer_id?: string;
  service_id?: string;
  provider_id?: string;
  appointment_time: string;
}

export interface Service {
  id: string;
  name: string;
  created_at?: string;
  duration: number;
  price: number;
  provider_id?: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: string;
  created_at?: string;
  name: string;
}

export interface ServiceProvider {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  lat?: number;
  lng?: number;
  services: string[];
  rating?: number;
  review_count?: number;
  phone?: string;
  website?: string;
  verified?: boolean;
  available_today?: boolean;
  created_at?: string;
  // Location property for compatibility
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
}
