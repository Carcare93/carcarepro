
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { carService } from '@/services/car-service';
import { supabaseService } from '@/services/supabase-service';
import { ServiceProvider as DBServiceProvider } from '@/types/supabase-models';
import { ServiceProvider as ApiServiceProvider } from '@/services/car-service';

// Create a type that works with both ServiceProvider types
type Provider = DBServiceProvider | ApiServiceProvider;

// Define extended provider type with the optional fields we need
interface EnhancedProvider extends ApiServiceProvider {
  verified?: boolean;
  available_today?: boolean;
}

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
          return dbProviders;
        }
        
        // If database is empty or error occurs, try the API
        if (!location) {
          console.log('No location provided, using mock data');
          const mockProviders = await carService.getServiceProviders();
          // Make sure each provider has the location field needed by our components
          return mockProviders.map((provider: ApiServiceProvider) => ({
            ...provider,
            verified: (provider as EnhancedProvider).verified !== undefined 
              ? (provider as EnhancedProvider).verified 
              : false,
            available_today: (provider as EnhancedProvider).available_today !== undefined 
              ? (provider as EnhancedProvider).available_today 
              : false
          }));
        }
        
        console.log('Using location to fetch providers:', location);
        const apiProviders = await carService.getServiceProviders(location);
        return apiProviders.map((provider: ApiServiceProvider) => ({
          ...provider,
          verified: (provider as EnhancedProvider).verified !== undefined 
            ? (provider as EnhancedProvider).verified 
            : false,
          available_today: (provider as EnhancedProvider).available_today !== undefined 
            ? (provider as EnhancedProvider).available_today 
            : false
        }));
      } catch (error) {
        // Fall back to mock data if all attempts fail
        console.error('Error fetching service providers:', error);
        const fallbackProviders = await carService.getServiceProviders();
        return fallbackProviders.map((provider: ApiServiceProvider) => ({
          ...provider,
          verified: (provider as EnhancedProvider).verified !== undefined 
            ? (provider as EnhancedProvider).verified 
            : false,
          available_today: (provider as EnhancedProvider).available_today !== undefined 
            ? (provider as EnhancedProvider).available_today 
            : false
        }));
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
