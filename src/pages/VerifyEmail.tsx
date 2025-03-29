
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/auth-service';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MailCheck, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const VerifyEmail = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the verification code.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await authService.verifyEmail(email, verificationCode);
      
      if (result.verified) {
        toast({
          title: "Email Verified",
          description: result.message,
        });
        
        // Redirect to the appropriate dashboard based on account type
        const user = authService.getCurrentUser();
        const redirectPath = user?.accountType === 'provider' ? '/provider' : '/';
        navigate(redirectPath);
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    try {
      const success = await authService.resendVerificationCode(email);
      
      if (success) {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to resend verification code. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while resending the code. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container pt-24 pb-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Verify Your Email</CardTitle>
              <CardDescription>
                We've sent a verification code to <span className="font-medium">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="verification-code" className="text-sm font-medium">
                    Verification Code
                  </label>
                  <Input
                    id="verification-code"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Verifying..." : "Verify Email"}
                  {!isSubmitting && <MailCheck className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-sm text-center mb-2">
                Didn't receive a code?
              </div>
              <Button 
                variant="outline" 
                onClick={handleResendCode} 
                disabled={isResending}
                className="w-full"
              >
                {isResending ? "Sending..." : "Resend Code"}
                {!isResending && <RefreshCw className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              For demo purposes, the verification code is logged to the console.
              In a real application, this would be sent via email.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
