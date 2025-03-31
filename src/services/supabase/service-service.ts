
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
}

export const serviceService = new ServiceService();
