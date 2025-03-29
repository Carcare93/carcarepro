
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Edit, X } from 'lucide-react';
import { ProviderProfile } from '@/services/auth-service';

interface ServicesTabProps {
  providerProfile: ProviderProfile;
}

const ServicesTab = ({ providerProfile }: ServicesTabProps) => {
  const [newService, setNewService] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState<string[]>(providerProfile.services);

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setServices(services.filter(s => s !== service));
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
                <Badge key={service} variant="secondary" className="text-sm py-1.5">
                  {service}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => removeService(service)}
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
