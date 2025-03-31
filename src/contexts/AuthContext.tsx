
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User, LoginData, RegisterData, ProviderRegisterData, VerificationStatus } from '@/services/auth-service';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData | ProviderRegisterData) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<VerificationStatus>;
  resendVerificationCode: (email: string) => Promise<boolean>;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          if (session?.user) {
            try {
              const currentUser = await authService.getCurrentUser();
              if (currentUser) setUser(currentUser);
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Check for existing session
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) setUser(currentUser);
      } catch (error) {
        console.error('Error checking current user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const user = await authService.login(data);
      setUser(user);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData | ProviderRegisterData) => {
    try {
      setIsLoading(true);
      const user = await authService.register(data);
      setUser(user);
      toast({
        title: "Account created!",
        description: "Your account has been created. Please check your email for verification.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<VerificationStatus> => {
    try {
      setIsLoading(true);
      const result = await authService.verifyEmail(email, code);
      
      if (result.verified) {
        const updatedUser = await authService.getCurrentUser();
        setUser(updatedUser);
      }
      
      return result;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Could not verify email. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async (email: string): Promise<boolean> => {
    try {
      return await authService.resendVerificationCode(email);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to resend code",
        description: error instanceof Error ? error.message : "Could not resend verification code. Please try again.",
      });
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isEmailVerified: !!user?.isEmailVerified,
        login,
        register,
        verifyEmail,
        resendVerificationCode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
