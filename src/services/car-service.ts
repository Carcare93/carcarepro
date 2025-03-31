import { Booking, BookingStatus, ServiceDuration } from '@/types/booking';
import { v4 as uuidv4 } from 'uuid';
import { authService, User } from './auth-service';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  accountType: 'customer' | 'provider';
  providerProfile?: ProviderProfile;
  vehicles?: Vehicle[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  owner?: string;
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
    duration: number; 
  }[];
  rating?: number;
  reviewCount?: number;
  website?: string;
  phone?: string;
  email?: string;
  businessHours?: Record<string, { open: string; close: string }>;
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
  rating?: number;
  reviewCount?: number;
  phone?: string;
  website?: string;
  businessHours?: Record<string, { open: string; close: string }>;
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Load user from localStorage if available
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async register(
    email: string,
    firstName: string,
    lastName: string,
    accountType: 'customer' | 'provider',
    providerProfileData?: Omit<ProviderProfile, 'id' | 'userId'>
  ): Promise<User> {
    // Basic email validation
    if (!email.includes('@')) {
      throw new Error('Invalid email address');
    }

    // Simulate user registration
    const newUser: User = {
      id: uuidv4(),
      email,
      firstName,
      lastName,
      accountType,
      ...(accountType === 'provider' && providerProfileData
        ? {
            providerProfile: {
              id: uuidv4(),
              userId: uuidv4(), // Mock user ID
              ...providerProfileData,
            },
          }
        : {}),
    };

    this.currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  }

  async login(email: string): Promise<User> {
    // Simulate fetching user data (replace with actual API call)
    const mockUser: User = {
      id: uuidv4(),
      email,
      firstName: 'John',
      lastName: 'Doe',
      accountType: 'customer',
      vehicles: [
        {
          id: uuidv4(),
          make: 'Toyota',
          model: 'Camry',
          year: 2018,
          licensePlate: 'ABC-123',
        },
      ],
    };

    // Simulate provider profile (optional)
    if (email === 'provider@example.com') {
      mockUser.accountType = 'provider';
      mockUser.providerProfile = {
        id: uuidv4(),
        userId: mockUser.id,
        businessName: 'Express Auto Care',
        location: {
          address: '123 Mechanic St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94101',
        },
        services: ['Oil Change', 'Tire Rotation', 'Brake Inspection'],
        rating: 4.5,
        reviewCount: 50,
        phone: '(415) 555-1212',
      };
    }

    this.currentUser = mockUser;
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    return mockUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  updateProviderProfile(profileData: Partial<ProviderProfile>): void {
    if (this.currentUser && this.currentUser.accountType === 'provider' && this.currentUser.providerProfile) {
      this.currentUser.providerProfile = {
        ...this.currentUser.providerProfile,
        ...profileData,
      };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    } else {
      throw new Error('User is not a provider or not logged in.');
    }
  }
}

export const authService = new AuthService();
