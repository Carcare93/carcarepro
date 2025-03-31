import { supabase } from '@/integrations/supabase/client';
import { supabaseService } from './supabase-service';

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
  private storageKey = 'car_care_user';
  
  // Convert Supabase user to our app's user format
  private mapSupabaseUser(supabaseUser: any, additionalData?: any): User {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.name || 'User',
      createdAt: supabaseUser.created_at,
      accountType: supabaseUser.user_metadata?.accountType || 'customer',
      isEmailVerified: supabaseUser.email_confirmed_at !== null,
      providerProfile: supabaseUser.user_metadata?.providerProfile,
      ...additionalData
    };
  }
  
  async register(data: RegisterData | ProviderRegisterData): Promise<User> {
    // Register with Supabase
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          accountType: data.accountType,
          ...(data.accountType === 'provider' && 'businessName' in data ? {
            providerProfile: {
              businessName: (data as ProviderRegisterData).businessName,
              services: (data as ProviderRegisterData).services,
              location: (data as ProviderRegisterData).location,
              phone: (data as ProviderRegisterData).phone,
              rating: 0,
              reviewCount: 0,
              verified: false
            }
          } : {})
        }
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!authData.user) {
      throw new Error('Registration failed, please try again');
    }
    
    // Also create user entry in our users table
    try {
      await supabaseService.createUser({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: data.accountType,
        ...(data.accountType === 'provider' && 'phone' in data ? {
          phone: (data as ProviderRegisterData).phone
        } : {})
      });
    } catch (err) {
      console.error('Error creating user in users table:', err);
      // We can continue even if this fails, as the auth user is created
    }
    
    return this.mapSupabaseUser(authData.user);
  }
  
  async verifyEmail(email: string, code: string): Promise<VerificationStatus> {
    // Supabase handles email verification automatically
    // This method is kept for API compatibility but won't do anything
    return { 
      verified: true, 
      message: 'Please check your email to complete verification' 
    };
  }
  
  async resendVerificationCode(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      
      if (error) {
        console.error('Error resending verification:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to resend verification:', error);
      return false;
    }
  }
  
  async login(data: LoginData): Promise<User> {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!authData.user) {
      throw new Error('Login failed');
    }
    
    // Get additional user data from our users table
    let userData = null;
    try {
      const users = await supabaseService.getUsers();
      userData = users?.find(u => u.id === authData.user.id);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
    
    return this.mapSupabaseUser(authData.user, userData);
  }
  
  logout(): void {
    supabase.auth.signOut();
    localStorage.removeItem(this.storageKey);
  }
  
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return null;
    }
    
    // Get additional user data from our users table
    let userData = null;
    try {
      const users = await supabaseService.getUsers();
      userData = users?.find(u => u.id === data.session.user.id);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
    
    const user = this.mapSupabaseUser(data.session.user, userData);
    return user;
  }
  
  isAuthenticated(): boolean {
    // Use synchronous check to avoid Promise issues
    return !!localStorage.getItem(this.storageKey);
  }
  
  isEmailVerified(): boolean {
    // Use synchronous check to avoid Promise issues
    const userStr = localStorage.getItem(this.storageKey);
    if (!userStr) return false;
    
    try {
      const user = JSON.parse(userStr);
      return !!user && !!user.isEmailVerified;
    } catch (e) {
      return false;
    }
  }
  
  isProvider(): boolean {
    // Use synchronous check to avoid Promise issues
    const userStr = localStorage.getItem(this.storageKey);
    if (!userStr) return false;
    
    try {
      const user = JSON.parse(userStr);
      return !!user && user.accountType === 'provider';
    } catch (e) {
      return false;
    }
  }
  
  async updateProviderProfile(providerProfile: Partial<ProviderProfile>): Promise<User> {
    const { data: userData, error } = await supabase.auth.updateUser({
      data: { providerProfile }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return this.mapSupabaseUser(userData.user);
  }
}

export const authService = new AuthService();
