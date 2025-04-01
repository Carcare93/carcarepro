
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabase-service';
import { useToast } from '@/hooks/use-toast';
import { serviceService } from '@/services/supabase/service-service';

/**
 * Hook for fetching bookings from Supabase
 */
export const useBookings = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        return await supabaseService.getBookings();
      } catch (error) {
        toast({
          title: 'Error fetching bookings',
          description: 'Could not load booking data',
          variant: 'destructive',
        });
        throw error;
      }
    },
  });
};

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
 * Hook for fetching users from Supabase
 */
export const useUsers = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await supabaseService.getUsers();
      } catch (error) {
        toast({
          title: 'Error fetching users',
          description: 'Could not load user data',
          variant: 'destructive',
        });
        throw error;
      }
    },
  });
};

/**
 * Hook for creating a booking
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (bookingData: any) => supabaseService.createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Booking created',
        description: 'Your booking has been successfully created',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating booking',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for updating a booking
 */
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ bookingId, bookingData }: { bookingId: string, bookingData: any }) => 
      supabaseService.updateBooking(bookingId, bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Booking updated',
        description: 'Your booking has been successfully updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating booking',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for deleting a booking
 */
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (bookingId: string) => supabaseService.deleteBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Booking deleted',
        description: 'The booking has been successfully deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting booking',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
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
