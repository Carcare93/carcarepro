
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/supabase-models";

/**
 * Service for interacting with the users table
 */
export class UserService {
  /**
   * Fetch data from the users table
   */
  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*') as { data: User[] | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
  
  /**
   * Create a new user
   */
  async createUser(userData: Omit<User, 'id'> & { id: string }) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select() as { data: User[] | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  /**
   * Update a user
   */
  async updateUser(userId: string, userData: Partial<User>) {
    try {
      console.log('Updating user:', userId, userData);
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select() as { data: User[] | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Get a user by ID
   */
  async getUserById(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single() as { data: User | null, error: any };
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
