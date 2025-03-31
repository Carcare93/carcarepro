
import { bookingService } from './supabase/booking-service';
import { serviceService } from './supabase/service-service';
import { userService } from './supabase/user-service';

/**
 * Service for interacting with Supabase tables
 */
export class SupabaseService {
  // Booking methods
  async getBookings() {
    return bookingService.getBookings();
  }
  
  async createBooking(bookingData: Omit<import('@/types/supabase-models').Booking, 'id'> & { id?: string }) {
    return bookingService.createBooking(bookingData);
  }
  
  async deleteBooking(bookingId: string) {
    return bookingService.deleteBooking(bookingId);
  }
  
  async updateBooking(bookingId: string, bookingData: Partial<import('@/types/supabase-models').Booking>) {
    return bookingService.updateBooking(bookingId, bookingData);
  }
  
  // Service methods
  async getServices() {
    return serviceService.getServices();
  }
  
  async createService(serviceData: Omit<import('@/types/supabase-models').Service, 'id'> & { id?: string }) {
    return serviceService.createService(serviceData);
  }
  
  // User methods
  async getUsers() {
    return userService.getUsers();
  }
  
  async createUser(userData: Omit<import('@/types/supabase-models').User, 'id'> & { id: string }) {
    return userService.createUser(userData);
  }
  
  async updateUser(userId: string, userData: Partial<import('@/types/supabase-models').User>) {
    return userService.updateUser(userId, userData);
  }
}

// Re-export the types for convenience, using export type to fix the isolatedModules error
export type { Booking, Service, User } from '@/types/supabase-models';

// Create and export a singleton instance
export const supabaseService = new SupabaseService();
