
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/booking-service';
import { Booking } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BookingStatusBadge from '@/components/bookings/BookingStatusBadge';

const BookingsTab = () => {
  const { toast } = useToast();
  
  // Fetch bookings
  const { 
    data: bookings = [], 
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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </div>
      
      {isLoadingBookings ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
          <p className="text-muted-foreground">
            You don't have any upcoming bookings at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{booking.serviceType}</CardTitle>
                    <CardDescription className="mt-1">
                      {booking.date} at {booking.time}
                    </CardDescription>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Vehicle</h4>
                    <p className="text-sm">
                      {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      License: {booking.vehicle.licensePlate}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Customer</h4>
                    <p className="text-sm">John Doe</p>
                    <p className="text-sm text-muted-foreground">
                      customer@example.com
                    </p>
                  </div>
                </div>
                {booking.notes && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-1">Notes</h4>
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div>
                  <span className="text-sm font-medium">
                    ${booking.price?.toFixed(2) || '—'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleAcceptBooking(booking.id)}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeclineBooking(booking.id)}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleCompleteBooking(booking.id)}
                    >
                      Complete
                    </Button>
                  )}
                  <Button size="sm" variant="outline">Details</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
