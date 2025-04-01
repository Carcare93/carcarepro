
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '@/services/supabase/service-service';
import { supabaseService } from '@/services/supabase-service';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for fetching services from Supabase using the service-service
 */
export const useServices = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const services = await serviceService.getServices();
        console.log('Fetched services:', services);
        return services;
      } catch (error) {
        console.error('Error fetching services:', error);
        toast({
          title: 'Error fetching services',
          description: 'Could not load service data',
          variant: 'destructive',
        });
        throw error;
      }
    },
  });
};

/**
 * Hook for creating a service
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (serviceData: any) => supabaseService.createService(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Service created',
        description: 'The service has been successfully created',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating service',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
};
