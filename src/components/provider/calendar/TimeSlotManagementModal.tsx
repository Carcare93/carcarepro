
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { serviceDurations } from '@/services/booking-service';

interface TimeSlotManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generate service types from durations map
const serviceTypes = Object.entries(serviceDurations)
  .filter(([name]) => !name.includes('(') && name !== 'default')
  .map(([name, duration]) => ({ 
    id: name.toLowerCase().replace(/\s+/g, '-'), 
    name, 
    defaultDuration: duration 
  }));

// Days of the week
const daysOfWeek = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' }
];

const TimeSlotManagementModal = ({ isOpen, onClose }: TimeSlotManagementModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('time-slots');
  const [workingHours, setWorkingHours] = useState([
    { dayId: 1, isWorking: true, startTime: '09:00', endTime: '17:00' },
    { dayId: 2, isWorking: true, startTime: '09:00', endTime: '17:00' },
    { dayId: 3, isWorking: true, startTime: '09:00', endTime: '17:00' },
    { dayId: 4, isWorking: true, startTime: '09:00', endTime: '17:00' },
    { dayId: 5, isWorking: true, startTime: '09:00', endTime: '17:00' },
    { dayId: 6, isWorking: false, startTime: '10:00', endTime: '15:00' },
    { dayId: 0, isWorking: false, startTime: '10:00', endTime: '15:00' }
  ]);

  const [serviceSettings, setServiceSettings] = useState(
    serviceTypes.map(service => ({
      serviceId: service.id,
      name: service.name,
      duration: service.defaultDuration,
      isEnabled: true,
      maxBookingsPerDay: 8
    }))
  );

  const handleSaveChanges = () => {
    // Here you would save the changes to your backend
    toast({
      title: "Settings saved",
      description: "Your time slot settings have been updated successfully."
    });
    onClose();
  };

  const handleWorkingHoursChange = (dayId: number, field: string, value: any) => {
    setWorkingHours(prev => 
      prev.map(day => day.dayId === dayId ? { ...day, [field]: value } : day)
    );
  };

  const handleServiceSettingChange = (serviceId: string, field: string, value: any) => {
    setServiceSettings(prev => 
      prev.map(service => service.serviceId === serviceId ? { ...service, [field]: value } : service)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Manage Time Slots & Availability</DialogTitle>
          <DialogDescription>
            Configure your working hours, service durations, and availability.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="time-slots" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="time-slots">Working Hours</TabsTrigger>
            <TabsTrigger value="services">Service Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="time-slots" className="py-4">
            <div className="space-y-4">
              {workingHours.map((day) => {
                const dayName = daysOfWeek.find(d => d.id === day.dayId)?.name;
                return (
                  <div key={day.dayId} className="flex items-center space-x-4">
                    <div className="w-24 flex-shrink-0">
                      <Label>{dayName}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={day.isWorking} 
                        onCheckedChange={(checked) => 
                          handleWorkingHoursChange(day.dayId, 'isWorking', checked)
                        } 
                      />
                      <span className="text-sm text-muted-foreground">
                        {day.isWorking ? 'Working' : 'Off'}
                      </span>
                    </div>
                    {day.isWorking && (
                      <div className="flex items-center space-x-2 flex-grow">
                        <div className="grid grid-cols-2 gap-2 flex-grow">
                          <div>
                            <Input 
                              type="time" 
                              value={day.startTime}
                              onChange={(e) => 
                                handleWorkingHoursChange(day.dayId, 'startTime', e.target.value)
                              } 
                            />
                          </div>
                          <div>
                            <Input 
                              type="time" 
                              value={day.endTime}
                              onChange={(e) => 
                                handleWorkingHoursChange(day.dayId, 'endTime', e.target.value)
                              } 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="py-4">
            <div className="space-y-4">
              {serviceSettings.map((service) => (
                <div key={service.serviceId} className="flex items-center space-x-4 border-b pb-4">
                  <div className="flex-grow">
                    <Label>{service.name}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={service.isEnabled} 
                      onCheckedChange={(checked) => 
                        handleServiceSettingChange(service.serviceId, 'isEnabled', checked)
                      } 
                    />
                    <span className="text-sm text-muted-foreground w-16">
                      {service.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {service.isEnabled && (
                    <>
                      <div className="w-32">
                        <Label className="text-xs mb-1 block">Duration (min)</Label>
                        <Select 
                          value={service.duration.toString()} 
                          onValueChange={(value) => 
                            handleServiceSettingChange(service.serviceId, 'duration', parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 min</SelectItem>
                            <SelectItem value="30">30 min</SelectItem>
                            <SelectItem value="45">45 min</SelectItem>
                            <SelectItem value="60">60 min</SelectItem>
                            <SelectItem value="90">90 min</SelectItem>
                            <SelectItem value="120">120 min</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24">
                        <Label className="text-xs mb-1 block">Max per day</Label>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={service.maxBookingsPerDay}
                          onChange={(e) => 
                            handleServiceSettingChange(
                              service.serviceId, 
                              'maxBookingsPerDay', 
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotManagementModal;
