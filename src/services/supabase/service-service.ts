
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/supabase-models";

/**
 * Service for interacting with the services table
 */
export class ServiceService {
  /**
   * Fetch data from the services table
   */
  async getServices() {
    try {
      console.log('Fetching services from Supabase...');
      const { data, error } = await supabase
        .from('services')
        .select('*') as { data: Service[] | null, error: any };
      
      if (error) {
        console.error('Supabase error fetching services:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No services found in Supabase');
      } else {
        console.log(`Found ${data.length} services in Supabase`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }
  
  /**
   * Get a specific service by ID
   */
  async getServiceById(serviceId: string) {
    try {
      console.log(`Fetching service with ID: ${serviceId}`);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .maybeSingle() as { data: Service | null, error: any };
      
      if (error) {
        console.error('Supabase error fetching service by ID:', error);
        throw error;
      }
      
      if (!data) {
        console.log(`No service found with ID: ${serviceId}`);
        return null;
      }
      
      console.log('Found service:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching service with ID ${serviceId}:`, error);
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
}

export const serviceService = new ServiceService();
