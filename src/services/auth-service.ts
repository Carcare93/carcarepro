
import { ApiService, apiService } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  accountType: 'customer' | 'provider';
  providerProfile?: ProviderProfile;
}

export interface ProviderProfile {
  businessName: string;
  services: string[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  description?: string;
  phone?: string;
  operatingHours?: {
    [key: string]: { open: string; close: string };
  };
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  accountType: 'customer' | 'provider';
}

export interface ProviderRegisterData extends RegisterData {
  businessName: string;
  services: string[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  private api: ApiService;
  private storageKey = 'car_care_user';
  
  constructor(api: ApiService = apiService) {
    this.api = api;
  }
  
  async register(data: RegisterData | ProviderRegisterData): Promise<User> {
    // In a real app, this would call the API to register the user
    // For now, we'll simulate a successful registration
    const user: User = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      email: data.email,
      name: data.name,
      createdAt: new Date().toISOString(),
      accountType: data.accountType || 'customer',
    };
    
    // If registering as provider, add provider profile data
    if (data.accountType === 'provider' && 'businessName' in data) {
      const providerData = data as ProviderRegisterData;
      user.providerProfile = {
        businessName: providerData.businessName,
        services: providerData.services,
        location: providerData.location,
        phone: providerData.phone,
        rating: 0,
        reviewCount: 0,
        verified: false,
      };
    }
    
    // Store user in localStorage to simulate authentication
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    
    return user;
  }
  
  async login(data: LoginData): Promise<User> {
    // In a real app, this would call the API to authenticate the user
    // For now, we'll simulate a successful login if email contains "test"
    if (!data.email.includes('test')) {
      throw new Error('Invalid credentials');
    }
    
    // For testing, create user based on the email pattern
    const isProvider = data.email.includes('provider');
    
    const user: User = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      email: data.email,
      name: data.email.split('@')[0],
      createdAt: new Date().toISOString(),
      accountType: isProvider ? 'provider' : 'customer',
    };
    
    // Add sample provider profile for testing
    if (isProvider) {
      user.providerProfile = {
        businessName: `${user.name}'s Auto Service`,
        services: ['Oil Change', 'Tire Rotation', 'Brake Service'],
        location: {
          address: '123 Service Lane',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10001',
        },
        phone: '(555) 123-4567',
        rating: 4.5,
        reviewCount: 12,
        verified: true,
      };
    }
    
    // Store user in localStorage to simulate authentication
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    
    return user;
  }
  
  logout(): void {
    localStorage.removeItem(this.storageKey);
  }
  
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.storageKey);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      this.logout();
      return null;
    }
  }
  
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
  
  isProvider(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.accountType === 'provider';
  }
  
  updateProviderProfile(providerProfile: Partial<ProviderProfile>): User {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    if (user.accountType !== 'provider') throw new Error('Not a provider account');
    
    const updatedUser = {
      ...user,
      providerProfile: {
        ...user.providerProfile,
        ...providerProfile
      }
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(updatedUser));
    return updatedUser;
  }
}

// Export a singleton instance for application use
export const authService = new AuthService();
