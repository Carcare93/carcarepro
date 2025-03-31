import { v4 as uuidv4 } from 'uuid';
import { ServiceDuration } from '@/types/booking';
import { ApiService, apiService } from './api';

// Define interfaces
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  owner?: string;
  userId?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  services: string[];
  serviceDetails?: { 
    name: string;
    duration: ServiceDuration; 
  }[];
  rating?: number;
  reviewCount?: number;
  website?: string;
  phone?: string;
  email?: string;
  businessHours?: Record<string, { open: string; close: string }>;
  verified?: boolean;
  available_today?: boolean;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  services: string[];
  serviceDetails?: { 
    name: string;
    duration: ServiceDuration; 
  }[];
  rating?: number;
  reviewCount?: number;
  phone?: string;
  website?: string;
  businessHours?: Record<string, { open: string; close: string }>;
}

export interface Invoice {
  id: string;
  vehicleId: string;
  serviceProviderId: string;
  date: string;
  amount: number;
  description?: string;
  services: string[];
  paid: boolean;
  fileUrl?: string;
}

// Car Service class
export class CarService {
  private api: ApiService;

  constructor(api: ApiService = apiService) {
    this.api = api;
  }

  async getUserVehicles(): Promise<Vehicle[]> {
    // In a real app, this would call the API with the current user's ID
    // For now, return mock data
    try {
      const vehicles = await this.api.get<Vehicle[]>('/vehicles');
      return vehicles;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return [
        {
          id: uuidv4(),
          make: 'Toyota',
          model: 'Camry',
          year: 2018,
          licensePlate: 'ABC-123',
        },
        {
          id: uuidv4(),
          make: 'Honda',
          model: 'Civic',
          year: 2020,
          licensePlate: 'XYZ-789',
        },
      ];
    }
  }

  async getVehicle(vehicleId: string): Promise<Vehicle | undefined> {
    try {
      const vehicle = await this.api.get<Vehicle>(`/vehicles/${vehicleId}`);
      return vehicle;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      const vehicles = await this.getUserVehicles();
      return vehicles.find(v => v.id === vehicleId);
    }
  }

  async addVehicle(newVehicle: Partial<Vehicle>): Promise<Vehicle> {
    try {
      const vehicle = await this.api.post<Vehicle>('/vehicles', newVehicle);
      return vehicle;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      // Mock response
      return {
        id: uuidv4(),
        make: newVehicle.make || '',
        model: newVehicle.model || '',
        year: newVehicle.year || new Date().getFullYear(),
        licensePlate: newVehicle.licensePlate || '',
        ...newVehicle
      };
    }
  }

  async getServiceProviders(location?: string): Promise<ServiceProvider[]> {
    try {
      const queryParams = location ? `?location=${encodeURIComponent(location)}` : '';
      const providers = await this.api.get<ServiceProvider[]>(`/service-providers${queryParams}`);
      return providers;
    } catch (error) {
      console.error('Error fetching service providers:', error);
      // Return mock data
      return [
        {
          id: uuidv4(),
          name: 'Auto Service Center',
          location: {
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            coordinates: { lat: 40.7128, lng: -74.0060 }
          },
          services: ['Oil Change', 'Brake Inspection', 'Tire Rotation'],
          serviceDetails: [
            { name: 'Oil Change', duration: 30 },
            { name: 'Brake Inspection', duration: 45 },
            { name: 'Tire Rotation', duration: 30 }
          ],
          rating: 4.5,
          reviewCount: 120,
          phone: '(555) 123-4567'
        },
        {
          id: uuidv4(),
          name: 'Quick Fix Auto',
          location: {
            address: '456 Broadway',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            coordinates: { lat: 40.7193, lng: -73.9990 }
          },
          services: ['Oil Change', 'Engine Diagnostic', 'AC Service'],
          serviceDetails: [
            { name: 'Oil Change', duration: 30 },
            { name: 'Engine Diagnostic', duration: 60 },
            { name: 'AC Service', duration: 90 }
          ],
          rating: 4.2,
          reviewCount: 85,
          phone: '(555) 987-6543'
        }
      ];
    }
  }

  async getVehicleInvoices(vehicleId: string): Promise<Invoice[]> {
    try {
      const invoices = await this.api.get<Invoice[]>(`/vehicles/${vehicleId}/invoices`);
      return invoices;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Return mock data
      return [
        {
          id: uuidv4(),
          vehicleId,
          serviceProviderId: 'service-provider-1',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          amount: 89.99,
          description: 'Regular maintenance',
          services: ['Oil Change', 'Tire Rotation'],
          paid: true,
          fileUrl: 'https://example.com/invoice-1.pdf'
        },
        {
          id: uuidv4(),
          vehicleId,
          serviceProviderId: 'service-provider-2',
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
          amount: 249.99,
          description: 'Brake service',
          services: ['Brake Pad Replacement', 'Brake Fluid Flush'],
          paid: true
        }
      ];
    }
  }

  async addInvoice(newInvoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    try {
      const invoice = await this.api.post<Invoice>(`/vehicles/${newInvoice.vehicleId}/invoices`, newInvoice);
      return invoice;
    } catch (error) {
      console.error('Error adding invoice:', error);
      // Mock response
      return {
        id: uuidv4(),
        ...newInvoice
      };
    }
  }

  async deleteInvoice(invoiceId: string): Promise<void> {
    try {
      await this.api.delete(`/invoices/${invoiceId}`);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      // Mock successful deletion
    }
  }
}

// Create and export a singleton instance
export const carService = new CarService();
