
import { supabase } from "@/integrations/supabase/client";

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
        .select('*');
      
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
  async createBooking(bookingData: any) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select();
      
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
        .select('*');
      
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
  async createService(serviceData: any) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select();
      
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
        .select('*');
      
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
  async createUser(userData: any) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select();
      
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
  async updateUser(userId: string, userData: any) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select();
      
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
        .eq('id', bookingId);
      
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
  async updateBooking(bookingId: string, bookingData: any) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', bookingId)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }
}

export const supabaseService = new SupabaseService();
