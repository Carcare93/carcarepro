import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useServices } from '@/hooks/useSupabaseData';
import { bookAppointment, getServiceDuration } from '@/services/booking-service';
import { ServiceDuration, BookingStatus } from '@/types/booking';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarIcon, ClockIcon } from 'lucide-react';

const ServiceReservation = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { data: services, isLoading } = useServices();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [vehicleInfo, setVehicleInfo] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: ''
  });
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = services?.find(service => service.id === serviceId);

  const availableTimes = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a reservation",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/service-reservation/${serviceId}` } });
      return;
    }
    
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Incomplete Information",
        description: "Please select a service, date and time",
        variant: "destructive"
      });
      return;
    }

    if (!vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.year || !vehicleInfo.licensePlate) {
      toast({
        title: "Vehicle Information Required",
        description: "Please provide complete vehicle information",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const serviceDuration: ServiceDuration = getServiceDuration(selectedService.name);
      
      const bookingStatus: BookingStatus = 'pending';
      
      const bookingData = {
        serviceType: selectedService.name,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: bookingStatus,
        provider: {
          id: selectedService.provider_id || '1',
          name: "Service Provider",
          location: {
            address: "123 Service St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            coordinates: { lat: 37.7749, lng: -122.4194 }
          },
          services: [selectedService.name],
          rating: 4.5,
          reviewCount: 100,
          phone: "(555) 555-5555"
        },
        vehicle: {
          id: new Date().getTime().toString(),
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          year: parseInt(vehicleInfo.year),
          licensePlate: vehicleInfo.licensePlate
        },
        price: selectedService.price,
        notes: notes,
        duration: serviceDuration
      };
      
      const booking = await bookAppointment(bookingData);
      
      toast({
        title: "Reservation Successful",
        description: "Your appointment has been scheduled",
      });
      
      navigate('/bookings');
      
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Reservation Failed",
        description: "There was a problem making your reservation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDays = (date: Date) => {
    return isBefore(date, startOfDay(new Date()));
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading service information...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!selectedService) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Service Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                The service you're looking for could not be found.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/services')}>
                Browse Services
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-10 px-4">
        <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-muted-foreground mb-8">
          Complete the form below to schedule your service appointment
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Selected Service</Label>
                    <div className="p-3 border rounded-md bg-muted/50">
                      <div className="font-medium">{selectedService.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {selectedService.description || 'No description available'}
                      </div>
                      <div className="mt-2 text-primary font-medium">
                        ${Number(selectedService.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Select Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={disabledDays}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Select Time</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimes.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input 
                        id="make" 
                        name="make" 
                        value={vehicleInfo.make}
                        onChange={handleInputChange}
                        placeholder="e.g. Toyota" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input 
                        id="model" 
                        name="model" 
                        value={vehicleInfo.model} 
                        onChange={handleInputChange}
                        placeholder="e.g. Camry" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input 
                        id="year" 
                        name="year" 
                        value={vehicleInfo.year} 
                        onChange={handleInputChange}
                        placeholder="e.g. 2020" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licensePlate">License Plate</Label>
                      <Input 
                        id="licensePlate" 
                        name="licensePlate" 
                        value={vehicleInfo.licensePlate} 
                        onChange={handleInputChange}
                        placeholder="e.g. ABC123" 
                        required 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input 
                    id="notes" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Any special instructions or additional information" 
                  />
                </CardContent>
              </Card>
              
              <Button 
                type="submit" 
                className="w-full md:w-auto" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Reservation'}
              </Button>
            </form>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Service</div>
                  <div className="font-medium">{selectedService.name}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Date & Time</div>
                  <div className="font-medium flex gap-2 items-center">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}
                  </div>
                  <div className="font-medium flex gap-2 items-center mt-1">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    {selectedTime}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Price</div>
                  <div className="text-xl font-bold text-primary">
                    ${Number(selectedService.price).toFixed(2)}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate('/services')}
                  >
                    Change Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceReservation;
