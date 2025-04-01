
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '@/services/supabase/vehicle-service';
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
        const vehicles = await vehicleService.getUserVehicles();
        console.log('Fetched vehicles:', vehicles);
        return vehicles as Vehicle[];
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
 * Hook for fetching a specific vehicle by ID
 */
export const useVehicle = (vehicleId: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: async () => {
      if (!vehicleId) return null;
      try {
        return await vehicleService.getVehicleById(vehicleId) as Vehicle | null;
      } catch (error) {
        toast({
          title: 'Error fetching vehicle',
          description: 'Could not load vehicle data',
          variant: 'destructive',
        });
        throw error;
      }
    },
    enabled: !!vehicleId,
  });
};

/**
 * Hook for creating a vehicle
 */
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (vehicleData: Omit<Vehicle, 'id'>) => vehicleService.addVehicle(vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Vehicle added',
        description: 'Your vehicle has been successfully added',
      });
    },
    onError: (error) => {
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
    mutationFn: ({ vehicleId, vehicleData }: { vehicleId: string, vehicleData: Partial<Vehicle> }) => 
      vehicleService.updateVehicle(vehicleId, vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Vehicle updated',
        description: 'Your vehicle has been successfully updated',
      });
    },
    onError: (error) => {
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
        description: 'The vehicle has been successfully deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting vehicle',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
};
