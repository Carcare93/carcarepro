
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User, LoginData, RegisterData, ProviderRegisterData, VerificationStatus } from '@/services/auth-service';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();

  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change event:", event);
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          if (session?.user) {
            // Use setTimeout to prevent potential deadlocks with Supabase auth
            setTimeout(async () => {
              try {
                console.log("Fetching user after auth state change");
                const currentUser = await authService.fetchCurrentUser();
                console.log("Current user from fetchCurrentUser:", currentUser);
                if (currentUser) {
                  setUser(currentUser);
                }
              } catch (error) {
                console.error('Error fetching user data:', error);
              } finally {
                setIsLoading(false);
              }
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing user state");
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const checkUser = async () => {
      try {
        console.log("Checking for existing user session");
        const currentUser = await authService.fetchCurrentUser();
        console.log("Current user from initial check:", currentUser);
        setUser(currentUser);
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
  
  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;
    
    // Skip redirects for routes that should be accessible regardless of auth state
    const publicPaths = ['/login', '/signup', '/about', '/contact', '/verify-email', '/home'];
    if (publicPaths.includes(location.pathname)) return;
    
    // Only perform redirects when auth state is settled
    if (!isLoading) {
      if (user && user.accountType === 'provider' && location.pathname === '/') {
        navigate('/provider', { replace: true });
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const user = await authService.login(data);
      setUser(user);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      // Redirect based on account type after login
      if (user.accountType === 'provider') {
        navigate('/provider', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
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
      console.log("AuthContext: Registering with data:", { ...data, password: "REDACTED" });
      
      // Check if this is a provider registration
      if (data.accountType === 'provider' && 'businessName' in data) {
        console.log("Provider registration detected with business name:", (data as ProviderRegisterData).businessName);
      }
      
      const user = await authService.register(data);
      console.log("Registration successful, user:", user);
      setUser(user);
      toast({
        title: "Account created!",
        description: "Your account has been created. Please check your email for verification.",
      });
    } catch (error) {
      console.error("Registration error:", error);
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
        const updatedUser = await authService.fetchCurrentUser();
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

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isEmailVerified: !!user?.isEmailVerified,
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
