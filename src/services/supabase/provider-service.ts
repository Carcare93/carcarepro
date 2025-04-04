
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
      // Check if the service_providers table exists in the database
      const { data, error } = await supabase
        .from('service_providers')
        .select('*');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Map the data to include the location property for compatibility
      const providers = (data || []).map(provider => {
        return {
          ...provider,
          location: {
            address: provider.address,
            city: provider.city,
            state: provider.state,
            zipCode: provider.zip_code,
            coordinates: provider.lat && provider.lng ? { 
              lat: provider.lat, 
              lng: provider.lng 
            } : undefined
          }
        } as ServiceProvider;
      });
      
      return providers;
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
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (data) {
        return {
          ...data,
          location: {
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zip_code,
            coordinates: data.lat && data.lng ? { 
              lat: data.lat, 
              lng: data.lng 
            } : undefined
          }
        } as ServiceProvider;
      }
      
      return null;
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
      // Extract location data to map to database fields
      const { location, ...otherData } = providerData;
      
      const insertData = {
        name: otherData.name,
        description: otherData.description,
        user_id: otherData.user_id,
        address: location.address,
        city: location.city,
        state: location.state,
        zip_code: location.zipCode,
        lat: location.coordinates?.lat,
        lng: location.coordinates?.lng,
        services: otherData.services || [],
        rating: otherData.rating || 0,
        review_count: otherData.review_count || 0,
        phone: otherData.phone,
        website: otherData.website,
        verified: otherData.verified || false,
        available_today: otherData.available_today || false
      };
      
      const { data, error } = await supabase
        .from('service_providers')
        .insert(insertData)
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (data && data[0]) {
        return {
          ...data[0],
          location: {
            address: data[0].address,
            city: data[0].city,
            state: data[0].state,
            zipCode: data[0].zip_code,
            coordinates: data[0].lat && data[0].lng ? { 
              lat: data[0].lat, 
              lng: data[0].lng 
            } : undefined
          }
        } as ServiceProvider;
      }
      
      return null;
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
      // Extract the basic provider data, excluding the location property
      const { location, ...basicData } = providerData;
      
      // Prepare the update data
      const updateData: any = { ...basicData };
      
      // If location is provided, map its properties
      if (location) {
        updateData.address = location.address;
        updateData.city = location.city;
        updateData.state = location.state;
        updateData.zip_code = location.zipCode;
        if (location.coordinates) {
          updateData.lat = location.coordinates.lat;
          updateData.lng = location.coordinates.lng;
        }
      }
      
      const { data, error } = await supabase
        .from('service_providers')
        .update(updateData)
        .eq('id', providerId)
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (data && data[0]) {
        return {
          ...data[0],
          location: {
            address: data[0].address,
            city: data[0].city,
            state: data[0].state,
            zipCode: data[0].zip_code,
            coordinates: data[0].lat && data[0].lng ? { 
              lat: data[0].lat, 
              lng: data[0].lng 
            } : undefined
          }
        } as ServiceProvider;
      }
      
      return null;
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
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting service provider:', error);
      throw error;
    }
  }
}

export const providerService = new ProviderService();
