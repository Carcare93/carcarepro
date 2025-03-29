import { ApiService, apiService } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  accountType: 'customer' | 'provider';
  providerProfile?: ProviderProfile;
  isEmailVerified?: boolean;
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

export interface VerificationStatus {
  verified: boolean;
  message: string;
}

export class AuthService {
  private api: ApiService;
  private storageKey = 'car_care_user';
  private verificationCodeKey = 'verification_code';
  
  constructor(api: ApiService = apiService) {
    this.api = api;
  }
  
  async register(data: RegisterData | ProviderRegisterData): Promise<User> {
    const user: User = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      email: data.email,
      name: data.name,
      createdAt: new Date().toISOString(),
      accountType: data.accountType || 'customer',
      isEmailVerified: false,
    };
    
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
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(this.verificationCodeKey + '_' + user.email, verificationCode);
    
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    
    console.log(`Verification code for ${user.email}: ${verificationCode}`);
    
    return user;
  }
  
  async verifyEmail(email: string, code: string): Promise<VerificationStatus> {
    const storedCode = localStorage.getItem(this.verificationCodeKey + '_' + email);
    
    if (!storedCode) {
      return { verified: false, message: 'Verification code not found. Please register again.' };
    }
    
    if (storedCode !== code) {
      return { verified: false, message: 'Invalid verification code. Please try again.' };
    }
    
    const userData = localStorage.getItem(this.storageKey);
    if (!userData) {
      return { verified: false, message: 'User not found. Please register again.' };
    }
    
    const user = JSON.parse(userData) as User;
    user.isEmailVerified = true;
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    
    localStorage.removeItem(this.verificationCodeKey + '_' + email);
    
    return { verified: true, message: 'Email successfully verified!' };
  }
  
  async resendVerificationCode(email: string): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user || user.email !== email) {
      return false;
    }
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(this.verificationCodeKey + '_' + email, verificationCode);
    
    console.log(`New verification code for ${email}: ${verificationCode}`);
    
    return true;
  }
  
  async login(data: LoginData): Promise<User> {
    if (!data.email.includes('test')) {
      throw new Error('Invalid credentials');
    }
    
    const isProvider = data.email.includes('provider');
    
    const user: User = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      email: data.email,
      name: data.email.split('@')[0],
      createdAt: new Date().toISOString(),
      accountType: isProvider ? 'provider' : 'customer',
    };
    
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
  
  isEmailVerified(): boolean {
    const user = this.getCurrentUser();
    return !!user && !!user.isEmailVerified;
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

export const authService = new AuthService();
