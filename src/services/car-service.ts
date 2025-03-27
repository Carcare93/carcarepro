
import { ApiService, apiService } from './api';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
  services: string[];
  rating: number;
  reviewCount: number;
}

export class CarService {
  private api: ApiService;
  
  constructor(api: ApiService = apiService) {
    this.api = api;
  }
  
  async getUserVehicles(): Promise<Vehicle[]> {
    return this.api.get<Vehicle[]>('/vehicles');
  }
  
  async getServiceProviders(location: string): Promise<ServiceProvider[]> {
    return this.api.get<ServiceProvider[]>(`/service-providers?location=${encodeURIComponent(location)}`);
  }
  
  async addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    return this.api.post<Vehicle>('/vehicles', vehicle);
  }
}

// Export a singleton instance for application use
export const carService = new CarService();
