
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Edit, X } from 'lucide-react';
import { ProviderProfile } from '@/services/auth-service';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ServiceDuration } from '@/types/booking';
import { standardDurations } from '@/services/booking-service';
import { toast } from '@/hooks/use-toast';

interface ServicesTabProps {
  providerProfile: ProviderProfile;
}

interface ServiceWithDuration {
  name: string;
  duration: ServiceDuration;
}

const ServicesTab = ({ providerProfile }: ServicesTabProps) => {
  const [newService, setNewService] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState<ServiceDuration>(30);
  const [isEditing, setIsEditing] = useState(false);
  
  // Convert plain string services to objects with duration
  const initialServices: ServiceWithDuration[] = providerProfile.services.map(service => ({
    name: service,
    duration: 30 // Default duration for existing services
  }));
  
  const [services, setServices] = useState<ServiceWithDuration[]>(initialServices);

  const addService = () => {
    if (newService.trim() && !services.some(s => s.name === newService.trim())) {
      setServices([...services, { 
        name: newService.trim(), 
        duration: newServiceDuration 
      }]);
      setNewService('');
      
      toast({
        title: "Service added",
        description: `"${newService}" (${newServiceDuration} min) has been added to your services.`
      });
    }
  };

  const removeService = (serviceName: string) => {
    setServices(services.filter(s => s.name !== serviceName));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Services</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? 'Done' : 'Edit'}
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Services</h3>
          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              services.map((service) => (
                <Badge key={service.name} variant="secondary" className="text-sm py-1.5">
                  {service.name} ({service.duration} min)
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => removeService(service.name)}
                  />
                </Badge>
              ))
            ) : (
              providerProfile.services.map((service) => (
                <Badge key={service} variant="secondary" className="text-sm py-1.5">
                  {service}
                </Badge>
              ))
            )}
          </div>
        </div>
        
        {isEditing && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Service</h3>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder="New service name..." 
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addService();
                      }
                    }}
                  />
                  <Button onClick={addService}>Add</Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-24">Duration:</span>
                  <Select 
                    value={newServiceDuration.toString()}
                    onValueChange={(value) => setNewServiceDuration(parseInt(value) as ServiceDuration)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {standardDurations.map(duration => (
                        <SelectItem key={duration} value={duration.toString()}>
                          {duration} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </>
        )}
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Operating Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <div key={day} className="flex justify-between items-center py-2">
                <span className="font-medium">{day}</span>
                <span>{day === 'Sunday' ? 'Closed' : '9:00 AM - 6:00 PM'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesTab;
