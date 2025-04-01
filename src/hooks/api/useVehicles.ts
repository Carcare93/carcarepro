
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabase-service';
import { useAuth } from '@/contexts/AuthContext';
import type { Vehicle } from '@/types/supabase-models';

/**
 * Hook for fetching vehicles from Supabase
 */
export const useVehicles = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      try {
        return await supabaseService.getVehicles();
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
      }
    },
    enabled: !!user, // Only run query if user is logged in
  });
};

/**
 * Hook for creating a new vehicle
 */
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vehicleData: Omit<Vehicle, 'id'>) => {
      return await supabaseService.createVehicle(vehicleData);
    },
    onSuccess: () => {
      // Invalidate the vehicles query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

/**
 * Hook for updating an existing vehicle
 */
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vehicleId, vehicleData }: { vehicleId: string, vehicleData: Partial<Vehicle> }) => {
      return await supabaseService.updateVehicle(vehicleId, vehicleData);
    },
    onSuccess: () => {
      // Invalidate the vehicles query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

/**
 * Hook for deleting a vehicle
 */
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vehicleId: string) => {
      return await supabaseService.deleteVehicle(vehicleId);
    },
    onSuccess: () => {
      // Invalidate the vehicles query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
