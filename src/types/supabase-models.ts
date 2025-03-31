
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
