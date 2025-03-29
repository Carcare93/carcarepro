
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Edit, ListCheck } from 'lucide-react';
import BookingsTab from '@/components/provider/BookingsTab';
import ServicesTab from '@/components/provider/ServicesTab';
import ProfileTab from '@/components/provider/ProfileTab';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect non-provider users
  useEffect(() => {
    if (!user || user.accountType !== 'provider') {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Don't render anything if user is not a provider
  if (!user || user.accountType !== 'provider' || !user.providerProfile) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your service offerings and bookings
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                View Public Profile
              </Button>
            </div>
            
            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="bookings" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden md:inline">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-2">
                  <ListCheck className="h-4 w-4" />
                  <span className="hidden md:inline">Services</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Bookings Tab */}
              <TabsContent value="bookings" className="mt-6">
                <BookingsTab />
              </TabsContent>
              
              {/* Services Tab */}
              <TabsContent value="services" className="mt-6">
                <ServicesTab providerProfile={user.providerProfile} />
              </TabsContent>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-6">
                <ProfileTab providerProfile={user.providerProfile} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderDashboard;
