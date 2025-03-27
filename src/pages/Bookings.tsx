
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, Car, ChevronRight, Filter } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookingStatus, Booking } from '@/types/booking';
import { fetchMockBookings } from '@/services/booking-service';
import BookingDetails from '@/components/bookings/BookingDetails';
import BookingStatusBadge from '@/components/bookings/BookingStatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import BookingFilters from '@/components/bookings/BookingFilters';

const Bookings = () => {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchMockBookings,
  });

  const filteredBookings = bookings?.filter(booking => 
    filterStatus === 'all' || booking.status === filterStatus
  );

  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would call an API to update the booking status
    toast({
      title: "Booking Cancelled",
      description: `Booking #${bookingId.substring(0, 8)} has been cancelled.`,
    });
    setSelectedBooking(null);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <EmptyState
            icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
            title="Error loading bookings"
            description="We couldn't load your bookings. Please try again later."
            action={<Button onClick={() => window.location.reload()}>Retry</Button>}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Your Bookings</h1>
              <p className="text-muted-foreground">Manage and track your automotive service appointments</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild>
                <a href="/discover" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Book New Service
                </a>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="all">All Bookings</TabsTrigger>
              </TabsList>
              
              <BookingFilters 
                currentFilter={filterStatus} 
                onFilterChange={setFilterStatus} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TabsContent value="upcoming" className="mt-0">
                  {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                      {[1, 2, 3].map((n) => (
                        <Card key={n} className="border border-border/40 animate-pulse">
                          <CardContent className="h-[140px]"></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredBookings?.filter(b => ['pending', 'confirmed'].includes(b.status)).length ? (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredBookings?.filter(b => ['pending', 'confirmed'].includes(b.status)).map((booking) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onClick={() => setSelectedBooking(booking)} 
                          isSelected={selectedBooking?.id === booking.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
                      title="No upcoming bookings"
                      description="You don't have any upcoming bookings scheduled at the moment."
                      action={
                        <Button asChild>
                          <a href="/discover">Book a Service</a>
                        </Button>
                      }
                    />
                  )}
                </TabsContent>

                <TabsContent value="past" className="mt-0">
                  {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                      {[1, 2].map((n) => (
                        <Card key={n} className="border border-border/40 animate-pulse">
                          <CardContent className="h-[140px]"></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredBookings?.filter(b => ['completed', 'cancelled'].includes(b.status)).length ? (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredBookings?.filter(b => ['completed', 'cancelled'].includes(b.status)).map((booking) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onClick={() => setSelectedBooking(booking)} 
                          isSelected={selectedBooking?.id === booking.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Clock className="h-12 w-12 text-muted-foreground" />}
                      title="No past bookings"
                      description="You don't have any past bookings or service history to display."
                    />
                  )}
                </TabsContent>

                <TabsContent value="all" className="mt-0">
                  {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                      {[1, 2, 3, 4].map((n) => (
                        <Card key={n} className="border border-border/40 animate-pulse">
                          <CardContent className="h-[140px]"></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredBookings?.length ? (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredBookings?.map((booking) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onClick={() => setSelectedBooking(booking)} 
                          isSelected={selectedBooking?.id === booking.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
                      title="No bookings found"
                      description="You don't have any bookings that match the selected filters."
                      action={
                        <Button variant="outline" onClick={() => setFilterStatus('all')}>
                          Clear Filters
                        </Button>
                      }
                    />
                  )}
                </TabsContent>
              </div>

              <div className="lg:col-span-1">
                {selectedBooking ? (
                  <BookingDetails 
                    booking={selectedBooking} 
                    onCancel={() => handleCancelBooking(selectedBooking.id)} 
                    onClose={() => setSelectedBooking(null)}
                  />
                ) : (
                  <Card className="border border-border/40 h-full bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="rounded-full bg-primary/10 p-4 mb-4">
                        <ChevronRight className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Booking Details</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        Select a booking to view its details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// BookingCard component
interface BookingCardProps {
  booking: Booking;
  onClick: () => void;
  isSelected: boolean;
}

const BookingCard = ({ booking, onClick, isSelected }: BookingCardProps) => {
  return (
    <Card 
      className={`border border-border/40 transition-all hover:border-primary/20 hover:shadow-sm cursor-pointer ${isSelected ? 'border-primary border-opacity-50 ring-1 ring-primary ring-opacity-20' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{booking.serviceType}</h3>
              <div className="text-sm text-muted-foreground flex gap-1 items-center mt-1">
                <MapPin className="h-3 w-3" /> 
                {booking.provider.name}
              </div>
            </div>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{format(new Date(booking.date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.time}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/40 flex justify-between items-center">
          <div className="text-sm">
            <span className="text-muted-foreground">Vehicle:</span> {booking.vehicle.make} {booking.vehicle.model}
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            Details <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Bookings;
