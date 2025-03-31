
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProviderProfileForm from '@/components/marketplace/ProviderProfileForm';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const ProviderRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/provider-registration`,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Could not log in. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container py-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-10">
        {!session ? (
          <div className="max-w-md mx-auto bg-white rounded-xl border border-border p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Become a Service Provider</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to create your service provider profile and start offering your services on our platform.
            </p>
            <Button onClick={handleLogin} className="w-full">
              Log In to Continue
            </Button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <ProviderProfileForm />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProviderRegistration;
