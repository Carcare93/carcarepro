
import { supabase } from "@/integrations/supabase/client";

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

/**
 * Service for interacting with Supabase tables
 */
export class SupabaseService {
  /**
   * Fetch data from the bookings table
   */
  async getBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*') as { data: Booking[] | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }
  
  /**
   * Create a new booking
   */
  async createBooking(bookingData: Omit<Booking, 'id'> & { id?: string }) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select() as { data: Booking[] | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
  
  /**
   * Fetch data from the services table
   */
  async getServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*') as { data: Service[] | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }
  
  /**
   * Create a new service
   */
  async createService(serviceData: Omit<Service, 'id'> & { id?: string }) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select() as { data: Service[] | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }
  
  /**
   * Fetch data from the users table
   */
  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*') as { data: User[] | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
  
  /**
   * Create a new user
   */
  async createUser(userData: Omit<User, 'id'> & { id: string }) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select() as { data: User[] | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  /**
   * Update a user
   */
  async updateUser(userId: string, userData: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select() as { data: User[] | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  
  /**
   * Delete a booking
   */
  async deleteBooking(bookingId: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId) as { error: any };
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }
  
  /**
   * Update a booking
   */
  async updateBooking(bookingId: string, bookingData: Partial<Booking>) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', bookingId)
        .select() as { data: Booking[] | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }
}

export const supabaseService = new SupabaseService();
