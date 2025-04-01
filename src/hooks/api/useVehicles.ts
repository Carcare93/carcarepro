
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '@/services/supabase/vehicle-service';
import type { Vehicle } from '@/types/supabase-models';

/**
 * Hook to fetch all vehicles for the current user
 */
export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      console.log('Fetching vehicles...');
      const vehicles = await vehicleService.getUserVehicles();
      console.log('Fetched vehicles:', vehicles);
      return vehicles;
    },
  });
};

/**
 * Hook to fetch a single vehicle by ID
 */
export const useVehicle = (vehicleId: string) => {
  return useQuery({
    queryKey: ['vehicles', vehicleId],
    queryFn: async () => {
      console.log(`Fetching vehicle with ID: ${vehicleId}`);
      return vehicleService.getVehicleById(vehicleId);
    },
    enabled: !!vehicleId,
  });
};

/**
 * Hook to create a new vehicle
 */
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vehicleData: Omit<Vehicle, 'id'>) => {
      console.log('Creating new vehicle:', vehicleData);
      return vehicleService.addVehicle(vehicleData);
    },
    onSuccess: () => {
      console.log('Vehicle created successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (error) => {
      console.error('Error creating vehicle:', error);
    },
  });
};

/**
 * Hook to update an existing vehicle
 */
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vehicleId, vehicleData }: { vehicleId: string, vehicleData: Partial<Vehicle> }) => {
      console.log(`Updating vehicle ${vehicleId}:`, vehicleData);
      return vehicleService.updateVehicle(vehicleId, vehicleData);
    },
    onSuccess: (_, variables) => {
      console.log('Vehicle updated successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', variables.vehicleId] });
    },
    onError: (error) => {
      console.error('Error updating vehicle:', error);
    },
  });
};

/**
 * Hook to delete a vehicle
 */
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vehicleId: string) => {
      console.log(`Deleting vehicle with ID: ${vehicleId}`);
      return vehicleService.deleteVehicle(vehicleId);
    },
    onSuccess: () => {
      console.log('Vehicle deleted successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (error) => {
      console.error('Error deleting vehicle:', error);
    },
  });
};
