
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
  private currentUser: User | null = null;
  
  // Convert Supabase user to our app's user format
  private mapSupabaseUser(supabaseUser: any, additionalData?: any): User {
    if (!supabaseUser) return null;
    
    console.log("Mapping Supabase user:", supabaseUser);
    console.log("Additional data:", additionalData);
    
    const userData = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.name || 'User',
      createdAt: supabaseUser.created_at,
      accountType: supabaseUser.user_metadata?.accountType || 'customer',
      isEmailVerified: supabaseUser.email_confirmed_at !== null,
      providerProfile: supabaseUser.user_metadata?.providerProfile,
      ...additionalData
    };
    
    console.log("Mapped user data:", userData);
    return userData;
  }
  
  async register(data: RegisterData | ProviderRegisterData): Promise<User> {
    console.log("Starting registration process with data:", { ...data, password: "REDACTED" });
    
    let metadataObj: any = {
      name: data.name,
      accountType: data.accountType
    };

    // If this is a provider registration, format the provider profile data properly
    if (data.accountType === 'provider' && 'businessName' in data) {
      console.log("Registering as provider with business data:", {
        businessName: (data as ProviderRegisterData).businessName,
        services: (data as ProviderRegisterData).services,
        location: (data as ProviderRegisterData).location,
      });
      
      metadataObj.providerProfile = {
        businessName: (data as ProviderRegisterData).businessName,
        services: (data as ProviderRegisterData).services,
        location: (data as ProviderRegisterData).location,
        phone: (data as ProviderRegisterData).phone,
        rating: 0,
        reviewCount: 0,
        verified: false
      };
    }
    
    console.log("Final metadata for Supabase registration:", metadataObj);
    
    // Register with Supabase
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: metadataObj
      }
    });
    
    if (error) {
      console.error("Supabase registration error:", error);
      throw new Error(error.message);
    }
    
    if (!authData.user) {
      console.error("Registration failed, no user data returned");
      throw new Error('Registration failed, please try again');
    }
    
    console.log("Supabase signUp successful:", authData);
    
    // Also create user entry in our users table
    try {
      console.log("Creating user in users table with ID:", authData.user.id);
      await supabaseService.createUser({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: data.accountType,
        ...(data.accountType === 'provider' && 'phone' in data ? {
          phone: (data as ProviderRegisterData).phone
        } : {})
      });
      console.log("User created in users table successfully");
      
      // Additionally, if this is a provider, also create the provider profile
      if (data.accountType === 'provider' && 'businessName' in data) {
        try {
          console.log("Creating provider in service_providers table");
          const providerData = {
            user_id: authData.user.id,
            name: (data as ProviderRegisterData).businessName,
            services: (data as ProviderRegisterData).services,
            address: (data as ProviderRegisterData).location.address,
            city: (data as ProviderRegisterData).location.city,
            state: (data as ProviderRegisterData).location.state,
            zip_code: (data as ProviderRegisterData).location.zipCode,
            phone: (data as ProviderRegisterData).phone,
            rating: 0,
            review_count: 0,
            verified: false,
            available_today: false,
            // Add the location property that's missing from the original code
            location: {
              address: (data as ProviderRegisterData).location.address,
              city: (data as ProviderRegisterData).location.city,
              state: (data as ProviderRegisterData).location.state,
              zipCode: (data as ProviderRegisterData).location.zipCode
            }
          };
          
          console.log("Provider data to save:", providerData);
          await supabaseService.createProvider(providerData);
          console.log("Provider created in service_providers table successfully");
        } catch (providerError) {
          console.error("Error creating provider in service_providers table:", providerError);
          // We continue even if provider creation fails, as the user account is created
        }
      }
    } catch (err) {
      console.error('Error creating user in users table:', err);
      // We can continue even if this fails, as the auth user is created
    }
    
    const user = this.mapSupabaseUser(authData.user);
    console.log("User mapped successfully:", user);
    this.currentUser = user;
    return user;
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
    
    const user = this.mapSupabaseUser(authData.user, userData);
    this.currentUser = user;
    return user;
  }
  
  logout(): void {
    console.log("Logging out user");
    supabase.auth.signOut();
    localStorage.removeItem(this.storageKey);
    this.currentUser = null;
  }
  
  // Async version that fetches fresh user data
  async fetchCurrentUser(): Promise<User | null> {
    console.log("Fetching current user");
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error fetching session:", error);
      this.currentUser = null;
      return null;
    }
    
    if (!data.session) {
      console.log("No active session found");
      this.currentUser = null;
      return null;
    }
    
    console.log("Active session found:", data.session);
    
    // Get additional user data from our users table
    let userData = null;
    try {
      const users = await supabaseService.getUsers();
      userData = users?.find(u => u.id === data.session.user.id);
      console.log("User data from users table:", userData);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
    
    const user = this.mapSupabaseUser(data.session.user, userData);
    console.log("Mapped user data:", user);
    this.currentUser = user;
    return user;
  }
  
  // Synchronous version that returns cached user data for quick access
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  isAuthenticated(): boolean {
    // Use synchronous check to avoid Promise issues
    return !!this.currentUser || !!localStorage.getItem(this.storageKey);
  }
  
  isEmailVerified(): boolean {
    // Use synchronous check to avoid Promise issues
    if (this.currentUser) {
      return !!this.currentUser.isEmailVerified;
    }
    
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
    if (this.currentUser) {
      return this.currentUser.accountType === 'provider';
    }
    
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
    console.log("Updating provider profile with data:", providerProfile);
    const { data: userData, error } = await supabase.auth.updateUser({
      data: { providerProfile }
    });
    
    if (error) {
      console.error("Error updating provider profile:", error);
      throw new Error(error.message);
    }
    
    const user = this.mapSupabaseUser(userData.user);
    console.log("Provider profile updated successfully:", user);
    this.currentUser = user;
    return user;
  }
}

export const authService = new AuthService();
