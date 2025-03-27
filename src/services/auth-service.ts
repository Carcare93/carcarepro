
import { ApiService, apiService } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
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
  
  async register(data: RegisterData): Promise<User> {
    // In a real app, this would call the API to register the user
    // For now, we'll simulate a successful registration
    const user: User = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      email: data.email,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    
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
    
    const user: User = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      email: data.email,
      name: data.email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    
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
}

// Export a singleton instance for application use
export const authService = new AuthService();
