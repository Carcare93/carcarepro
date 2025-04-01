
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import type { Vehicle } from "@/types/supabase-models";

/**
 * Service for interacting with the vehicles table
 */
export class VehicleService {
  /**
   * Get all vehicles for the current user
   */
  async getUserVehicles() {
    try {
      console.log('Fetching user vehicles from Supabase...');
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
      }
      
      console.log('Fetched vehicles:', data);
      return data || [];
    } catch (error) {
      console.error('Error in getUserVehicles:', error);
      throw error;
    }
  }
  
  /**
   * Get a vehicle by ID
   */
  async getVehicleById(vehicleId: string) {
    try {
      console.log(`Fetching vehicle with ID: ${vehicleId}`);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching vehicle by ID:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Error in getVehicleById for ${vehicleId}:`, error);
      throw error;
    }
  }
  
  /**
   * Add a new vehicle for the current user
   */
  async addVehicle(vehicleData: Omit<Vehicle, 'id'>) {
    try {
      console.log('Adding new vehicle:', vehicleData);
      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicleData)
        .select();
      
      if (error) {
        console.error('Error adding vehicle:', error);
        throw error;
      }
      
      console.log('Added vehicle:', data);
      return data[0];
    } catch (error) {
      console.error('Error in addVehicle:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing vehicle
   */
  async updateVehicle(vehicleId: string, vehicleData: Partial<Vehicle>) {
    try {
      console.log(`Updating vehicle ${vehicleId}:`, vehicleData);
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', vehicleId)
        .select();
      
      if (error) {
        console.error('Error updating vehicle:', error);
        throw error;
      }
      
      console.log('Updated vehicle:', data);
      return data[0];
    } catch (error) {
      console.error(`Error in updateVehicle for ${vehicleId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a vehicle
   */
  async deleteVehicle(vehicleId: string) {
    try {
      console.log(`Deleting vehicle with ID: ${vehicleId}`);
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);
      
      if (error) {
        console.error('Error deleting vehicle:', error);
        throw error;
      }
      
      console.log('Vehicle deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error in deleteVehicle for ${vehicleId}:`, error);
      throw error;
    }
  }
}

export const vehicleService = new VehicleService();
