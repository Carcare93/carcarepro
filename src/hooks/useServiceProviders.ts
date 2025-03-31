
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { carService } from '@/services/car-service';
import { supabaseService, ServiceProvider } from '@/services/supabase-service';

export const useServiceProviders = (location: string) => {
  const { toast } = useToast();

  const { data: providers = [], isLoading, error } = useQuery({
    queryKey: ['serviceProviders', location],
    queryFn: async () => {
      try {
        // Try to get providers from Supabase
        const dbProviders = await supabaseService.getProviders();
        
        // If we have providers from the database, return them
        if (dbProviders && dbProviders.length > 0) {
          console.log('Found providers in database:', dbProviders);
          return dbProviders as ServiceProvider[];
        }
        
        // If database is empty or error occurs, try the API
        if (!location) {
          console.log('No location provided, using mock data');
          return await carService.getServiceProviders();
        }
        
        console.log('Using location to fetch providers:', location);
        return await carService.getServiceProviders(location);
      } catch (error) {
        // Fall back to mock data if all attempts fail
        console.error('Error fetching service providers:', error);
        return await carService.getServiceProviders();
      }
    },
  });

  useEffect(() => {
    // Check if geolocation is available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location accessed",
            description: "We can now show you nearby service providers.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Location access denied",
            description: "Please enter your location manually to find services near you.",
          });
        }
      );
    }
  }, [toast]);

  return { providers, isLoading, error };
};
