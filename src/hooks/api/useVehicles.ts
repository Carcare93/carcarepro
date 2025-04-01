
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '@/services/supabase/vehicle-service';
import { supabaseService } from '@/services/supabase-service';
import { useToast } from '@/hooks/use-toast';
import type { Vehicle } from '@/types/supabase-models';

/**
 * Hook for fetching vehicles from Supabase
 */
export const useVehicles = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      try {
        return await vehicleService.getUserVehicles();
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast({
          title: 'Error fetching vehicles',
          description: 'Could not load vehicle data',
          variant: 'destructive',
        });
        throw error;
      }
    },
  });
};

/**
 * Hook for fetching a vehicle by ID
 */
export const useVehicle = (vehicleId: string | undefined) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['vehicles', vehicleId],
    queryFn: async () => {
      if (!vehicleId) {
        return null;
      }
      try {
        return await vehicleService.getVehicleById(vehicleId);
      } catch (error) {
        console.error(`Error fetching vehicle ${vehicleId}:`, error);
        toast({
          title: 'Error fetching vehicle',
          description: 'Could not load vehicle details',
          variant: 'destructive',
        });
        throw error;
      }
    },
    enabled: !!vehicleId,
  });
};

/**
 * Hook for creating a new vehicle
 */
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (vehicleData: Omit<Vehicle, 'id'>) => {
      console.log('Creating vehicle with data:', vehicleData);
      return vehicleService.addVehicle(vehicleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Vehicle added',
        description: 'Your vehicle has been successfully added',
      });
    },
    onError: (error) => {
      console.error('Error creating vehicle:', error);
      toast({
        title: 'Error adding vehicle',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for updating a vehicle
 */
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ vehicleId, vehicleData }: { vehicleId: string; vehicleData: Partial<Vehicle> }) => 
      vehicleService.updateVehicle(vehicleId, vehicleData),
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', vehicleId] });
      toast({
        title: 'Vehicle updated',
        description: 'Your vehicle has been successfully updated',
      });
    },
    onError: (error) => {
      console.error('Error updating vehicle:', error);
      toast({
        title: 'Error updating vehicle',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for deleting a vehicle
 */
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (vehicleId: string) => vehicleService.deleteVehicle(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Vehicle deleted',
        description: 'Your vehicle has been successfully removed',
      });
    },
    onError: (error) => {
      console.error('Error deleting vehicle:', error);
      toast({
        title: 'Error deleting vehicle',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
};
