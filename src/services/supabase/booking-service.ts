
import { supabase } from "@/integrations/supabase/client";
import { Booking } from "@/types/supabase-models";

/**
 * Service for interacting with the bookings table
 */
export class BookingService {
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

export const bookingService = new BookingService();
