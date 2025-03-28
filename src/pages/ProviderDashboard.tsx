
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService, ProviderProfile } from '@/services/auth-service';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar, Edit, Check, X, Clock, List, ListCheck } from 'lucide-react';
import { fetchMockBookings } from '@/services/booking-service';
import BookingStatusBadge from '@/components/bookings/BookingStatusBadge';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { bookingService } from '@/services/booking-service';

const ProviderDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Redirect non-provider users
  if (!user || user.accountType !== 'provider') {
    navigate('/');
    return null;
  }
  
  const providerProfile = user.providerProfile;
  if (!providerProfile) {
    navigate('/');
    return null;
  }
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<Partial<ProviderProfile>>({
    businessName: providerProfile.businessName,
    description: providerProfile.description || '',
    phone: providerProfile.phone || '',
    services: [...providerProfile.services],
    location: { ...providerProfile.location },
  });
  
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['providerBookings'],
    queryFn: fetchMockBookings,
  });
  
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
  
  // New service input handling
  const [newService, setNewService] = useState('');
  
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your service offerings and bookings
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                View Public Profile
              </Button>
            </div>
            
            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="bookings" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden md:inline">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-2">
                  <ListCheck className="h-4 w-4" />
                  <span className="hidden md:inline">Services</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Bookings Tab */}
              <TabsContent value="bookings" className="mt-6">
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
                                  <Button size="sm" variant="default">Accept</Button>
                                  <Button size="sm" variant="outline">Decline</Button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <Button size="sm" variant="default">Complete</Button>
                              )}
                              <Button size="sm" variant="outline">Details</Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Services Tab */}
              <TabsContent value="services" className="mt-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Your Services</h2>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Current Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {providerProfile.services.map((service) => (
                          <Badge key={service} variant="secondary" className="text-sm py-1.5">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
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
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Operating Hours</h3>
                      {/* Sample operating hours - would be editable in a full implementation */}
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
              </TabsContent>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-6">
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderDashboard;
