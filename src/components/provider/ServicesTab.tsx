
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Edit, X, Save } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Convert plain string services to objects with duration
  const initialServices: ServiceWithDuration[] = (providerProfile.services || []).map(service => ({
    name: service,
    duration: 30 // Default duration for existing services
  }));
  
  const [services, setServices] = useState<ServiceWithDuration[]>(initialServices);
  
  // Update services when providerProfile changes
  useEffect(() => {
    const updatedServices = (providerProfile.services || []).map(service => ({
      name: service,
      duration: 30 // Default duration for existing services
    }));
    setServices(updatedServices);
  }, [providerProfile.services]);

  const addService = async () => {
    if (newService.trim() && !services.some(s => s.name === newService.trim())) {
      const newServiceItem = { 
        name: newService.trim(), 
        duration: newServiceDuration 
      };
      
      const updatedServices = [...services, newServiceItem];
      setServices(updatedServices);
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
  
  const saveChanges = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to save changes."
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Extract service names from the services array
      const serviceNames = services.map(service => service.name);
      
      // Get the provider's record from the database
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (providerError) {
        throw new Error(providerError.message);
      }
      
      // Update the services array in the database
      const { error: updateError } = await supabase
        .from('service_providers')
        .update({ services: serviceNames })
        .eq('id', providerData.id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      toast({
        title: "Services updated",
        description: "Your services have been successfully updated."
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving services:', error);
      toast({
        variant: "destructive",
        title: "Failed to save changes",
        description: error instanceof Error ? error.message : "An error occurred while saving your services."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Services</h2>
        {isEditing ? (
          <div className="flex gap-2">
            <Button 
              variant="default" 
              size="sm"
              onClick={saveChanges}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Services</h3>
          {services.length === 0 ? (
            <p className="text-muted-foreground">No services added yet. Click 'Edit' to add services.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1.5">
                    {service.name} ({service.duration} min)
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeService(service.name)}
                    />
                  </Badge>
                ))
              ) : (
                services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1.5">
                    {service.name} ({service.duration} min)
                  </Badge>
                ))
              )}
            </div>
          )}
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
