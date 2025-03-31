
import { supabase } from "@/integrations/supabase/client";
import { ServiceProvider } from "@/types/supabase-models";

/**
 * Service for interacting with the service_providers table
 */
export class ProviderService {
  /**
   * Fetch all service providers
   */
  async getProviders() {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*') as { data: ServiceProvider[] | null, error: any };
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching service providers:', error);
      throw error;
    }
  }
  
  /**
   * Fetch a specific service provider by ID
   */
  async getProvider(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('id', providerId)
        .single() as { data: ServiceProvider | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching service provider:', error);
      throw error;
    }
  }
  
  /**
   * Create a new service provider profile
   */
  async createProvider(providerData: Omit<ServiceProvider, 'id'> & { id?: string }) {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .insert(providerData)
        .select() as { data: ServiceProvider[] | null, error: any };
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error creating service provider:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing service provider
   */
  async updateProvider(providerId: string, providerData: Partial<ServiceProvider>) {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .update(providerData)
        .eq('id', providerId)
        .select() as { data: ServiceProvider[] | null, error: any };
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error updating service provider:', error);
      throw error;
    }
  }
  
  /**
   * Delete a service provider
   */
  async deleteProvider(providerId: string) {
    try {
      const { error } = await supabase
        .from('service_providers')
        .delete()
        .eq('id', providerId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting service provider:', error);
      throw error;
    }
  }
}

export const providerService = new ProviderService();
