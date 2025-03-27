
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Phone, Car, CreditCard, User, X } from 'lucide-react';
import { Booking } from '@/types/booking';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import BookingStatusBadge from './BookingStatusBadge';

interface BookingDetailsProps {
  booking: Booking;
  onCancel: () => void;
  onClose: () => void;
}

const BookingDetails = ({ booking, onCancel, onClose }: BookingDetailsProps) => {
  const canCancel = ['pending', 'confirmed'].includes(booking.status);
  const isPast = ['completed', 'cancelled'].includes(booking.status);
  
  return (
    <Card className="border border-border/40">
      <CardHeader className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="absolute right-4 top-4"
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="text-xl">Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{booking.serviceType}</h3>
            <p className="text-sm text-muted-foreground">{booking.provider.name}</p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <Separator />
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Date</span>
            </div>
            <span className="font-medium">{format(new Date(booking.date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Time</span>
            </div>
            <span className="font-medium">{booking.time}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Vehicle</span>
            </div>
            <span className="font-medium">{booking.vehicle.make} {booking.vehicle.model} ({booking.vehicle.year})</span>
          </div>
          {booking.vehicle.licensePlate && (
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm ml-6">License plate</span>
              </div>
              <span className="font-medium">{booking.vehicle.licensePlate}</span>
            </div>
          )}
        </div>

        <Separator />
        
        <div className="space-y-4">
          <h4 className="font-medium">Service Provider</h4>
          <div className="bg-muted/50 rounded-lg p-4">
            <h5 className="font-semibold">{booking.provider.name}</h5>
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{booking.provider.location.address}, {booking.provider.location.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{booking.provider.phone || '(555) 123-4567'}</span>
              </div>
            </div>
          </div>
        </div>

        {booking.notes && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-sm">{booking.notes}</p>
            </div>
          </>
        )}
        
        {!isPast && booking.price && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Payment</h4>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Estimated price</span>
                </div>
                <span className="font-semibold">${booking.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Payment will be collected after the service is completed</p>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3">
        {canCancel && (
          <Button 
            variant="destructive" 
            onClick={onCancel}
            className="w-full"
          >
            Cancel Booking
          </Button>
        )}
        {booking.status === 'confirmed' && !isPast && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open(`https://maps.google.com/?q=${booking.provider.location.address}`, '_blank')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingDetails;
