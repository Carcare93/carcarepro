
import React, { useState } from 'react';
import { authService, ProviderProfile } from '@/services/auth-service';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Check, Edit } from 'lucide-react';

interface ProfileTabProps {
  providerProfile: ProviderProfile;
}

const ProfileTab = ({ providerProfile }: ProfileTabProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<Partial<ProviderProfile>>({
    businessName: providerProfile.businessName,
    description: providerProfile.description || '',
    phone: providerProfile.phone || '',
    services: [...providerProfile.services],
    location: { ...providerProfile.location },
  });
  const [newService, setNewService] = useState('');

  const handleProfileUpdate = () => {
    try {
      authService.updateProviderProfile(profileData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your provider profile has been updated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
      });
    }
  };
  
  const cancelEditing = () => {
    setProfileData({
      businessName: providerProfile.businessName,
      description: providerProfile.description || '',
      phone: providerProfile.phone || '',
      services: [...providerProfile.services],
      location: { ...providerProfile.location },
    });
    setIsEditing(false);
  };
  
  const addService = () => {
    if (newService.trim() && !profileData.services?.includes(newService.trim())) {
      setProfileData({
        ...profileData,
        services: [...(profileData.services || []), newService.trim()]
      });
      setNewService('');
    }
  };
  
  const removeService = (service: string) => {
    setProfileData({
      ...profileData,
      services: profileData.services?.filter(s => s !== service) || []
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Business Profile</h2>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleProfileUpdate}>
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={cancelEditing}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Business Name</h3>
            {isEditing ? (
              <Input 
                value={profileData.businessName || ''}
                onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
              />
            ) : (
              <p>{providerProfile.businessName}</p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Phone Number</h3>
            {isEditing ? (
              <Input 
                value={profileData.phone || ''}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              />
            ) : (
              <p>{providerProfile.phone || '—'}</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Business Description</h3>
          {isEditing ? (
            <Textarea 
              value={profileData.description || ''}
              onChange={(e) => setProfileData({...profileData, description: e.target.value})}
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-muted-foreground">
              {providerProfile.description || 'No description provided.'}
            </p>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Location</h3>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Street Address"
                value={profileData.location?.address || ''}
                onChange={(e) => setProfileData({
                  ...profileData, 
                  location: {...profileData.location, address: e.target.value}
                })}
              />
              <Input 
                placeholder="City"
                value={profileData.location?.city || ''}
                onChange={(e) => setProfileData({
                  ...profileData, 
                  location: {...profileData.location, city: e.target.value}
                })}
              />
              <Input 
                placeholder="State"
                value={profileData.location?.state || ''}
                onChange={(e) => setProfileData({
                  ...profileData, 
                  location: {...profileData.location, state: e.target.value}
                })}
              />
              <Input 
                placeholder="ZIP Code"
                value={profileData.location?.zipCode || ''}
                onChange={(e) => setProfileData({
                  ...profileData, 
                  location: {...profileData.location, zipCode: e.target.value}
                })}
              />
            </div>
          ) : (
            <p>
              {providerProfile.location.address}, {providerProfile.location.city},{' '}
              {providerProfile.location.state} {providerProfile.location.zipCode}
            </p>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Services Offered</h3>
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profileData.services?.map((service) => (
                  <Badge key={service} variant="secondary" className="text-sm py-1.5">
                    {service}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeService(service)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add new service..." 
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
          ) : (
            <div className="flex flex-wrap gap-2">
              {providerProfile.services.map((service) => (
                <Badge key={service} variant="secondary" className="text-sm py-1.5">
                  {service}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Account Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{providerProfile.rating?.toFixed(1) || '—'}</p>
                <p className="text-xs text-muted-foreground">
                  {providerProfile.reviewCount || 0} reviews
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$1,240</p>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
