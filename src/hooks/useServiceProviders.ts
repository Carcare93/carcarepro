
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { carService } from '@/services/car-service';
import { supabaseService, ServiceProvider } from '@/services/supabase-service';

// Mapper function to convert from database ServiceProvider to our app's format
const mapServiceProvider = (provider: any): ServiceProvider => {
  return {
    id: provider.id,
    name: provider.name,
    location: {
      address: provider.address,
      city: provider.city,
      state: provider.state,
      zipCode: provider.zip_code,
      coordinates: provider.lat && provider.lng ? { 
        lat: provider.lat, 
        lng: provider.lng 
      } : undefined
    },
    services: provider.services || [],
    rating: provider.rating,
    reviewCount: provider.review_count,
    phone: provider.phone,
    verified: provider.verified,
    availableToday: provider.available_today
  };
};

// Mock providers data as fallback
const mockProviders = [
  {
    id: "1",
    name: "AutoCare Express",
    image: "https://images.unsplash.com/photo-1632823469850-2f77dd9c7c93?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.8,
    reviewCount: 324,
    location: {
      address: "123 Main Street, Downtown",
      city: "Metropolis",
      state: "NY",
      zipCode: "10001",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    specialties: ["Oil Change", "Brakes", "Tires"],
    services: ["Oil Change", "Brake Repair", "Tire Replacement", "Wheel Alignment"],
    availability: ["Today", "Tomorrow", "Wednesday"],
    pricing: {
      "Oil Change": "$49.99",
      "Brake Inspection": "Free",
      "Brake Pad Replacement": "$180.00",
      "Tire Rotation": "$25.00"
    },
    verified: true,
    availableToday: true,
    phone: "(555) 123-4567"
  },
  {
    id: "2",
    name: "Premier Auto Service",
    image: "https://images.unsplash.com/photo-1629384997254-86acaa07dbaa?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.9,
    reviewCount: 187,
    location: {
      address: "456 Oak Avenue, West End",
      city: "Metropolis",
      state: "NY",
      zipCode: "10002",
      coordinates: { lat: 40.7148, lng: -74.0068 }
    },
    specialties: ["Diagnostics", "Engine Repair", "Electrical"],
    services: ["Engine Diagnostics", "Engine Repair", "Electrical System Repair", "Battery Replacement"],
    availability: ["Tomorrow", "Thursday", "Friday"],
    pricing: {
      "Check Engine Light Diagnosis": "$89.99",
      "Battery Replacement": "$149.99",
      "Alternator Replacement": "$350.00",
      "Starter Replacement": "$275.00"
    },
    verified: true,
    availableToday: false,
    phone: "(555) 234-5678"
  },
  {
    id: "3",
    name: "TireWorld Plus",
    image: "https://images.unsplash.com/photo-1486127635871-6aa255f6de7d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.7,
    reviewCount: 256,
    location: {
      address: "789 Pine Street, South Side",
      city: "Metropolis",
      state: "NY",
      zipCode: "10003",
      coordinates: { lat: 40.7117, lng: -74.0045 }
    },
    specialties: ["Tire Replacement", "Alignment", "Rotation"],
    services: ["Tire Sales", "Tire Installation", "Wheel Alignment", "Tire Pressure Monitoring"],
    availability: ["Today", "Tomorrow", "Friday"],
    pricing: {
      "Tire Installation (per tire)": "$20.00",
      "Wheel Alignment": "$89.99",
      "Tire Rotation": "$29.99",
      "Tire Pressure Monitoring System Service": "$49.99"
    },
    verified: false,
    availableToday: true,
    phone: "(555) 345-6789"
  },
  {
    id: "4",
    name: "Eastside Mechanics",
    image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.6,
    reviewCount: 142,
    location: {
      address: "321 Elm Street, East Village",
      city: "Metropolis",
      state: "NY",
      zipCode: "10004",
      coordinates: { lat: 40.7155, lng: -74.0090 }
    },
    specialties: ["Full Service", "Inspection", "AC Repair"],
    services: ["AC Repair", "State Inspection", "Full Service", "Suspension Repair"],
    availability: ["Today", "Thursday", "Friday"],
    pricing: {
      "AC System Check": "$59.99",
      "AC Recharge": "$119.99",
      "State Inspection": "$39.99",
      "Suspension Inspection": "$49.99"
    },
    verified: true,
    availableToday: true,
    phone: "(555) 456-7890"
  },
  {
    id: "5",
    name: "North Star Auto",
    image: "https://images.unsplash.com/photo-1518295751675-2d9e4b583597?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.5,
    reviewCount: 98,
    location: {
      address: "555 Maple Drive, North District",
      city: "Metropolis",
      state: "NY",
      zipCode: "10005",
      coordinates: { lat: 40.7210, lng: -74.0050 }
    },
    specialties: ["Oil Change", "Transmission", "Cooling System"],
    services: ["Oil Change", "Transmission Service", "Cooling System Flush", "Radiator Replacement"],
    availability: ["Tomorrow", "Wednesday", "Thursday"],
    pricing: {
      "Synthetic Oil Change": "$69.99",
      "Transmission Fluid Change": "$149.99",
      "Cooling System Flush": "$109.99",
      "Radiator Inspection": "$29.99"
    },
    verified: true,
    availableToday: false,
    phone: "(555) 567-8910"
  },
  {
    id: "6",
    name: "City Central Repairs",
    image: "https://images.unsplash.com/photo-1507171945151-491b640082a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.4,
    reviewCount: 211,
    location: {
      address: "888 Broadway, City Center",
      city: "Metropolis",
      state: "NY",
      zipCode: "10006",
      coordinates: { lat: 40.7190, lng: -74.0075 }
    },
    specialties: ["Brakes", "Suspension", "Steering"],
    services: ["Brake Service", "Suspension Repair", "Steering System", "Wheel Balancing"],
    availability: ["Today", "Wednesday", "Friday"],
    pricing: {
      "Brake Pad Replacement (Front)": "$169.99",
      "Brake Fluid Flush": "$89.99",
      "Strut Replacement": "$350.00/pair",
      "Wheel Balancing": "$49.99"
    },
    verified: false,
    availableToday: true,
    phone: "(555) 678-9012"
  }
];

export const useServiceProviders = (location: string) => {
  const { toast } = useToast();

  const { data: providers = [], isLoading, error } = useQuery({
    queryKey: ['serviceProviders', location],
    queryFn: async () => {
      try {
        // Try to get providers from Supabase
        const dbProviders = await supabaseService.getProviders();
        
        // If we have providers from the database, map them to our app format
        if (dbProviders && dbProviders.length > 0) {
          return dbProviders.map(mapServiceProvider);
        }
        
        // If database is empty or error occurs, try the API
        if (!location) return mockProviders;
        return await carService.getServiceProviders(location);
      } catch (error) {
        // Fall back to mock data if all attempts fail
        console.error('Error fetching service providers:', error);
        return mockProviders;
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
