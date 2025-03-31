
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/booking-service';
import { authService } from '@/services/auth-service';
import BookingsTab from '@/components/provider/BookingsTab';
import ServicesTab from '@/components/provider/ServicesTab';
import ProfileTab from '@/components/provider/ProfileTab';
import CalendarView from '@/components/provider/CalendarView';
import { Booking } from '@/types/booking';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const ProviderDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bookings");

  // Fetch provider profile
  const { 
    data: providerProfile, 
    isLoading: isLoadingProfile 
  } = useQuery({
    queryKey: ['providerProfile'],
    queryFn: authService.getProviderProfile.bind(authService),
  });

  // Fetch bookings
  const { 
    data: bookings = [] as Booking[], 
    isLoading: isLoadingBookings, 
    refetch: refetchBookings 
  } = useQuery<Booking[]>({
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
        title: "Service completed",
        description: "The booking has been marked as completed.",
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Provider Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="bookings" className="flex-1">Bookings</TabsTrigger>
            <TabsTrigger value="calendar" className="flex-1">Calendar</TabsTrigger>
            <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
            <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-6">
            <BookingsTab />
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-6">
            {isLoadingBookings ? (
              <Skeleton className="h-[600px] w-full rounded-xl" />
            ) : (
              <CalendarView 
                bookings={bookings}
                isLoading={isLoadingBookings}
                onAcceptBooking={handleAcceptBooking}
                onDeclineBooking={handleDeclineBooking}
                onCompleteBooking={handleCompleteBooking}
              />
            )}
          </TabsContent>
          
          <TabsContent value="services" className="space-y-6">
            {isLoadingProfile ? (
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-[500px] w-full" />
                </CardContent>
              </Card>
            ) : providerProfile ? (
              <ServicesTab providerProfile={providerProfile} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>Unable to load profile data.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6">
            {isLoadingProfile ? (
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-[500px] w-full" />
                </CardContent>
              </Card>
            ) : providerProfile ? (
              <ProfileTab providerProfile={providerProfile} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>Unable to load profile data.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderDashboard;
