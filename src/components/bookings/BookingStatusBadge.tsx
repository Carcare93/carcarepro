
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookingStatus } from '@/types/booking';
import { Clock, CheckCircle2, XCircle, CalendarCheck } from 'lucide-react';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case 'confirmed':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
          <CalendarCheck className="h-3 w-3" />
          Confirmed
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Cancelled
        </Badge>
      );
    default:
      return null;
  }
};

export default BookingStatusBadge;
