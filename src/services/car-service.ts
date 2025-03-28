
import { ApiService, apiService } from './api';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  userId?: string; // Add userId to track vehicle ownership
}

export interface Invoice {
  id: string;
  vehicleId: string;
  serviceProviderId: string;
  date: string;
  amount: number;
  description: string;
  services: string[];
  paid: boolean;
  fileUrl?: string; // Optional URL to an invoice PDF or image
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
  phone: string;
}

export class CarService {
  private api: ApiService;
  private vehicleStorageKey = 'car_care_vehicles';
  private invoiceStorageKey = 'car_care_invoices';
  
  constructor(api: ApiService = apiService) {
    this.api = api;
  }
  
  async getUserVehicles(): Promise<Vehicle[]> {
    // Get vehicles from local storage for demo purposes
    // In a real app, this would call the API with the user's ID
    const storedVehicles = localStorage.getItem(this.vehicleStorageKey);
    if (storedVehicles) {
      return JSON.parse(storedVehicles) as Vehicle[];
    }
    return [];
  }
  
  async getServiceProviders(location: string): Promise<ServiceProvider[]> {
    return this.api.get<ServiceProvider[]>(`/service-providers?location=${encodeURIComponent(location)}`);
  }
  
  async addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    // Create a new vehicle with a random ID
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `vehicle-${Math.random().toString(36).substring(2, 9)}`
    };
    
    // Get existing vehicles
    const vehicles = await this.getUserVehicles();
    
    // Add the new vehicle
    const updatedVehicles = [...vehicles, newVehicle];
    
    // Save to local storage
    localStorage.setItem(this.vehicleStorageKey, JSON.stringify(updatedVehicles));
    
    return newVehicle;
  }

  async getVehicleInvoices(vehicleId: string): Promise<Invoice[]> {
    // Get invoices from local storage
    const storedInvoices = localStorage.getItem(this.invoiceStorageKey);
    if (storedInvoices) {
      const allInvoices = JSON.parse(storedInvoices) as Invoice[];
      // Filter invoices for the specific vehicle
      return allInvoices.filter(invoice => invoice.vehicleId === vehicleId);
    }
    return [];
  }

  async addInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    // Create a new invoice with a random ID
    const newInvoice: Invoice = {
      ...invoice,
      id: `invoice-${Math.random().toString(36).substring(2, 9)}`
    };
    
    // Get existing invoices
    const storedInvoices = localStorage.getItem(this.invoiceStorageKey);
    const invoices = storedInvoices ? JSON.parse(storedInvoices) as Invoice[] : [];
    
    // Add the new invoice
    const updatedInvoices = [...invoices, newInvoice];
    
    // Save to local storage
    localStorage.setItem(this.invoiceStorageKey, JSON.stringify(updatedInvoices));
    
    return newInvoice;
  }

  async deleteInvoice(invoiceId: string): Promise<void> {
    // Get existing invoices
    const storedInvoices = localStorage.getItem(this.invoiceStorageKey);
    if (storedInvoices) {
      const invoices = JSON.parse(storedInvoices) as Invoice[];
      
      // Filter out the invoice to delete
      const updatedInvoices = invoices.filter(invoice => invoice.id !== invoiceId);
      
      // Save to local storage
      localStorage.setItem(this.invoiceStorageKey, JSON.stringify(updatedInvoices));
    }
  }
}

// Export a singleton instance for application use
export const carService = new CarService();
