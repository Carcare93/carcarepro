
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User, LoginData, RegisterData, VerificationStatus } from '@/services/auth-service';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<VerificationStatus>;
  resendVerificationCode: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Important: Define as a React functional component with correct prop typing
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
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

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const user = await authService.register(data);
      setUser(user);
      toast({
        title: "Account created!",
        description: "Your account has been created. Please verify your email.",
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
        // Update the user state to reflect the verified status
        const updatedUser = authService.getCurrentUser();
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
