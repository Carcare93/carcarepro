
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Edit, ListCheck, User } from 'lucide-react';
import BookingsTab from '@/components/provider/BookingsTab';
import ServicesTab from '@/components/provider/ServicesTab';
import ProfileTab from '@/components/provider/ProfileTab';
import CalendarView from '@/components/provider/CalendarView';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/booking-service';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/types/booking';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Redirect non-provider users
  useEffect(() => {
    if (!user || user.accountType !== 'provider') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch bookings - ensure we initialize with an empty array
  const { 
    data: bookings = [] as Booking[], 
    isLoading: isLoadingBookings, 
    refetch: refetchBookings 
  } = useQuery({
    queryKey: ['providerBookings'],
    queryFn: bookingService.getProviderBookings.bind(bookingService),
  });
  
  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await bookingService.acceptBooking(bookingId);
      await refetchBookings();
      toast({
        title: "Booking accepted",
        description: "The booking has been confirmed successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "Failed to accept booking. Please try again.",
      });
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      await bookingService.declineBooking(bookingId);
      await refetchBookings();
      toast({
        title: "Booking declined",
        description: "The booking has been declined.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "Failed to decline booking. Please try again.",
      });
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      await bookingService.completeBooking(bookingId);
      await refetchBookings();
      toast({
        title: "Booking completed",
        description: "The service has been marked as completed.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "Failed to complete booking. Please try again.",
      });
    }
  };
  
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
              <Button variant="outline" onClick={() => navigate('/provider-profile')}>
                View Public Profile
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="bookings" className="flex items-center gap-2">
                  <ListCheck className="h-4 w-4" />
                  <span className="hidden md:inline">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden md:inline">Calendar</span>
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
              
              <TabsContent value="bookings" className="mt-6">
                <BookingsTab />
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-6">
                <CalendarView 
                  bookings={bookings}
                  isLoading={isLoadingBookings}
                  onAcceptBooking={handleAcceptBooking}
                  onDeclineBooking={handleDeclineBooking}
                  onCompleteBooking={handleCompleteBooking}
                />
              </TabsContent>
              
              <TabsContent value="services" className="mt-6">
                <ServicesTab providerProfile={user.providerProfile} />
              </TabsContent>
              
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
