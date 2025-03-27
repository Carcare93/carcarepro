
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  User, 
  Car, 
  Calendar, 
  Settings, 
  Bell, 
  CreditCard, 
  LogOut, 
  ChevronRight, 
  Clock, 
  CheckCircle,
  X,
  Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    joinDate: 'January 2023',
    avatar: null, // Placeholder for profile image
  };
  
  // Mock vehicle data
  const vehicles = [
    {
      id: '1',
      name: 'Tesla Model 3',
      year: '2021',
      licensePlate: 'ABC1234',
      vin: 'WDDGF4HB7CR2****',
      lastService: '2023-08-15',
      nextServiceDue: '2023-11-15',
      image: 'https://images.unsplash.com/photo-1570335366841-cc5dbb4ad6e8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500'
    },
    {
      id: '2',
      name: 'Toyota Camry',
      year: '2019',
      licensePlate: 'XYZ9876',
      vin: '4T1BF1FK5GU6****',
      lastService: '2023-09-05',
      nextServiceDue: '2024-01-05',
      image: 'https://images.unsplash.com/photo-1612997951747-2a6ec81ec74c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500'
    },
  ];
  
  // Mock appointments data
  const appointments = [
    {
      id: '1',
      service: 'Oil Change',
      provider: 'AutoCare Express',
      providerImage: 'https://images.unsplash.com/photo-1632823469850-2f77dd9c7c93?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=100',
      date: '2023-10-25',
      time: '10:00 AM',
      vehicle: 'Tesla Model 3',
      status: 'upcoming',
      price: '$49.99'
    },
    {
      id: '2',
      service: 'Tire Rotation',
      provider: 'TireWorld Plus',
      providerImage: 'https://images.unsplash.com/photo-1486127635871-6aa255f6de7d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=100',
      date: '2023-09-15',
      time: '2:30 PM',
      vehicle: 'Tesla Model 3',
      status: 'completed',
      price: '$29.99'
    },
    {
      id: '3',
      service: 'Brake Inspection',
      provider: 'City Central Repairs',
      providerImage: 'https://images.unsplash.com/photo-1507171945151-491b640082a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=100',
      date: '2023-08-05',
      time: '11:15 AM',
      vehicle: 'Toyota Camry',
      status: 'completed',
      price: 'Free'
    },
  ];
  
  // Mock service history data
  const serviceHistory = [
    {
      id: '1',
      service: 'Tire Rotation',
      provider: 'TireWorld Plus',
      date: '2023-09-15',
      vehicle: 'Tesla Model 3',
      price: '$29.99',
      notes: 'Rotated all four tires and checked tire pressure.'
    },
    {
      id: '2',
      service: 'Brake Inspection',
      provider: 'City Central Repairs',
      date: '2023-08-05',
      vehicle: 'Toyota Camry',
      price: 'Free',
      notes: 'Brake pads at 70%, recommended replacement within next 6 months.'
    },
    {
      id: '3',
      service: 'Oil Change',
      provider: 'AutoCare Express',
      date: '2023-07-10',
      vehicle: 'Tesla Model 3',
      price: '$49.99',
      notes: 'Changed oil and filter. Used synthetic oil 5W-30.'
    },
    {
      id: '4',
      service: 'Battery Replacement',
      provider: 'Premier Auto Service',
      date: '2023-06-22',
      vehicle: 'Toyota Camry',
      price: '$149.99',
      notes: 'Replaced battery with new 24F battery. Tested alternator output.'
    },
  ];
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar */}
              <div className="md:w-64 shrink-0">
                <div className="bg-white rounded-xl border border-border p-6 sticky top-28">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  
                  <nav className="space-y-1">
                    {[
                      { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
                      { id: 'vehicles', label: 'My Vehicles', icon: <Car className="h-4 w-4" /> },
                      { id: 'appointments', label: 'Appointments', icon: <Calendar className="h-4 w-4" /> },
                      { id: 'history', label: 'Service History', icon: <Clock className="h-4 w-4" /> },
                      { id: 'settings', label: 'Account Settings', icon: <Settings className="h-4 w-4" /> },
                      { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
                      { id: 'payment', label: 'Payment Methods', icon: <CreditCard className="h-4 w-4" /> },
                    ].map((item) => (
                      <button
                        key={item.id}
                        className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          activeTab === item.id
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                        onClick={() => setActiveTab(item.id)}
                      >
                        {React.cloneElement(item.icon, { className: `h-4 w-4 ${activeTab === item.id ? 'text-primary' : ''}` })}
                        {item.label}
                      </button>
                    ))}
                    <button
                      className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </nav>
                </div>
              </div>
              
              {/* Main content */}
              <div className="flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Overview tab */}
                  <TabsContent value="overview" className="mt-0">
                    <div className="bg-white rounded-xl border border-border p-6 mb-6">
                      <h2 className="text-2xl font-semibold mb-6">Welcome back, {user.name.split(' ')[0]}!</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-secondary rounded-lg p-4">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-medium">Upcoming Appointment</h3>
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          {appointments.filter(a => a.status === 'upcoming').length > 0 ? (
                            <div>
                              <p className="text-base font-semibold">{appointments.filter(a => a.status === 'upcoming')[0].service}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(appointments.filter(a => a.status === 'upcoming')[0].date)} at {appointments.filter(a => a.status === 'upcoming')[0].time}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                          )}
                        </div>
                        
                        <div className="bg-secondary rounded-lg p-4">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-medium">Vehicles</h3>
                            <Car className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-base font-semibold">{vehicles.length}</p>
                          <p className="text-sm text-muted-foreground">Registered vehicles</p>
                        </div>
                        
                        <div className="bg-secondary rounded-lg p-4">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-medium">Next Service Due</h3>
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-base font-semibold">{formatDate(vehicles[0].nextServiceDue)}</p>
                          <p className="text-sm text-muted-foreground">{vehicles[0].name}</p>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
                      {appointments.filter(a => a.status === 'upcoming').length > 0 ? (
                        <div className="space-y-4">
                          {appointments.filter(a => a.status === 'upcoming').map((appointment) => (
                            <div key={appointment.id} className="flex items-center justify-between border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full overflow-hidden">
                                  <img 
                                    src={appointment.providerImage} 
                                    alt={appointment.provider} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{appointment.service}</p>
                                  <p className="text-sm text-muted-foreground">{appointment.provider} • {appointment.vehicle}</p>
                                  <p className="text-sm text-muted-foreground">{formatDate(appointment.date)} at {appointment.time}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-sm font-medium">{appointment.price}</p>
                                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                    Upcoming
                                  </span>
                                </div>
                                <Button variant="ghost" size="icon">
                                  <ChevronRight className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-secondary/50 rounded-lg">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground mb-4">You have no upcoming appointments</p>
                          <Button>Book a Service</Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl border border-border p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold">My Vehicles</h3>
                          <Button variant="outline" size="sm">Add Vehicle</Button>
                        </div>
                        <div className="space-y-4">
                          {vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="flex gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer border border-border">
                              <div className="h-16 w-24 rounded-md overflow-hidden">
                                <img 
                                  src={vehicle.image} 
                                  alt={vehicle.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{vehicle.name}</p>
                                <p className="text-sm text-muted-foreground">{vehicle.year} • {vehicle.licensePlate}</p>
                                <div className="flex items-center mt-1">
                                  <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                                  <p className="text-xs text-muted-foreground">
                                    Next service: {formatDate(vehicle.nextServiceDue)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl border border-border p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold">Recent Service History</h3>
                          <Button variant="outline" size="sm">View All</Button>
                        </div>
                        <div className="space-y-4">
                          {serviceHistory.slice(0, 3).map((service) => (
                            <div key={service.id} className="p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer border border-border">
                              <div className="flex justify-between mb-1">
                                <p className="font-medium">{service.service}</p>
                                <p className="text-sm">{service.price}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">{service.provider} • {service.vehicle}</p>
                              <p className="text-xs text-muted-foreground mt-1">{formatDate(service.date)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Vehicles tab */}
                  <TabsContent value="vehicles" className="mt-0">
                    <div className="bg-white rounded-xl border border-border p-6 mb-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">My Vehicles</h2>
                        <Button>Add New Vehicle</Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {vehicles.map((vehicle) => (
                          <div key={vehicle.id} className="border border-border rounded-xl overflow-hidden bg-white hover:shadow-md transition-all">
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={vehicle.image} 
                                alt={vehicle.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-6">
                              <h3 className="text-xl font-semibold mb-2">{vehicle.name}</h3>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Year</p>
                                  <p className="font-medium">{vehicle.year}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">License Plate</p>
                                  <p className="font-medium">{vehicle.licensePlate}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">VIN</p>
                                  <p className="font-medium">{vehicle.vin}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Last Service</p>
                                  <p className="font-medium">{formatDate(vehicle.lastService)}</p>
                                </div>
                              </div>
                              <div className="p-3 rounded-lg bg-primary/5 mb-4">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-primary mr-2" />
                                  <div>
                                    <p className="text-sm font-medium">Next Service Due</p>
                                    <p className="text-sm">{formatDate(vehicle.nextServiceDue)}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <Button variant="outline" className="flex-1">Edit</Button>
                                <Button className="flex-1">Book Service</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Appointments tab */}
                  <TabsContent value="appointments" className="mt-0">
                    <div className="bg-white rounded-xl border border-border p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">My Appointments</h2>
                        <Button>Book New Appointment</Button>
                      </div>
                      
                      <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList className="mb-6">
                          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                          <TabsTrigger value="completed">Completed</TabsTrigger>
                          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="upcoming" className="mt-0">
                          {appointments.filter(a => a.status === 'upcoming').length > 0 ? (
                            <div className="space-y-4">
                              {appointments.filter(a => a.status === 'upcoming').map((appointment) => (
                                <div key={appointment.id} className="flex flex-col md:flex-row md:items-center justify-between border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                                    <div className="h-14 w-14 rounded-lg overflow-hidden">
                                      <img 
                                        src={appointment.providerImage} 
                                        alt={appointment.provider} 
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium">{appointment.service}</p>
                                      <p className="text-sm text-muted-foreground">{appointment.provider}</p>
                                      <div className="flex items-center mt-1">
                                        <Calendar className="h-3 w-3 text-primary mr-1" />
                                        <p className="text-xs">{formatDate(appointment.date)} at {appointment.time}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 ml-0 md:ml-auto">
                                    <div className="text-right">
                                      <p className="text-sm font-medium">{appointment.price}</p>
                                      <p className="text-xs text-muted-foreground">{appointment.vehicle}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm">Reschedule</Button>
                                      <Button variant="destructive" size="sm">Cancel</Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 bg-secondary/50 rounded-lg">
                              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                              <p className="text-lg font-medium mb-1">No upcoming appointments</p>
                              <p className="text-muted-foreground mb-4">You don't have any scheduled appointments.</p>
                              <Button>Book a Service</Button>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="completed" className="mt-0">
                          {appointments.filter(a => a.status === 'completed').length > 0 ? (
                            <div className="space-y-4">
                              {appointments.filter(a => a.status === 'completed').map((appointment) => (
                                <div key={appointment.id} className="flex flex-col md:flex-row md:items-center justify-between border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                                    <div className="h-14 w-14 rounded-lg overflow-hidden">
                                      <img 
                                        src={appointment.providerImage} 
                                        alt={appointment.provider} 
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium">{appointment.service}</p>
                                      <p className="text-sm text-muted-foreground">{appointment.provider}</p>
                                      <div className="flex items-center mt-1">
                                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                                        <p className="text-xs">{formatDate(appointment.date)} at {appointment.time}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 ml-0 md:ml-auto">
                                    <div className="text-right">
                                      <p className="text-sm font-medium">{appointment.price}</p>
                                      <p className="text-xs text-muted-foreground">{appointment.vehicle}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm">Details</Button>
                                      <Button size="sm">Book Again</Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 bg-secondary/50 rounded-lg">
                              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                              <p className="text-lg font-medium mb-1">No completed appointments</p>
                              <p className="text-muted-foreground mb-4">You don't have any completed appointments yet.</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="cancelled" className="mt-0">
                          <div className="text-center py-12 bg-secondary/50 rounded-lg">
                            <X className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-lg font-medium mb-1">No cancelled appointments</p>
                            <p className="text-muted-foreground mb-4">You don't have any cancelled appointments.</p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </TabsContent>
                  
                  {/* Service History tab */}
                  <TabsContent value="history" className="mt-0">
                    <div className="bg-white rounded-xl border border-border p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Service History</h2>
                        <div className="flex gap-3">
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Vehicles</SelectItem>
                              <SelectItem value="tesla">Tesla Model 3</SelectItem>
                              <SelectItem value="camry">Toyota Camry</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline">Export</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {serviceHistory.map((service) => (
                          <div key={service.id} className="border border-border rounded-lg p-5 hover:bg-secondary/50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-medium mb-1">{service.service}</h3>
                                <p className="text-sm text-muted-foreground">{service.provider} • {service.vehicle}</p>
                              </div>
                              <div className="mt-3 md:mt-0 flex items-center gap-3">
                                <span className="text-sm font-medium">{service.price}</span>
                                <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                                  {formatDate(service.date)}
                                </span>
                              </div>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Service Notes:</p>
                              <p className="text-sm text-muted-foreground">{service.notes}</p>
                            </div>
                            
                            <div className="flex gap-3 mt-4 justify-end">
                              <Button variant="outline" size="sm">View Details</Button>
                              <Button size="sm">Book Again</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Settings tab */}
                  <TabsContent value="settings" className="mt-0">
                    <div className="bg-white rounded-xl border border-border p-6">
                      <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
                      
                      <div className="space-y-6 max-w-2xl">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="full-name">Full Name</Label>
                              <Input id="full-name" defaultValue={user.name} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input id="email" defaultValue={user.email} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input id="phone" defaultValue={user.phone} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="dob">Date of Birth</Label>
                              <Input id="dob" type="date" />
                            </div>
                          </div>
                          <Button className="mt-4">Save Changes</Button>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Password</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="current-password">Current Password</Label>
                              <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">New Password</Label>
                              <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">Confirm New Password</Label>
                              <Input id="confirm-password" type="password" />
                            </div>
                          </div>
                          <Button className="mt-4">Update Password</Button>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Preferences</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="language">Language</Label>
                              <Select defaultValue="en">
                                <SelectTrigger id="language">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="distance-unit">Distance Unit</Label>
                              <Select defaultValue="miles">
                                <SelectTrigger id="distance-unit">
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="miles">Miles</SelectItem>
                                  <SelectItem value="km">Kilometers</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button className="mt-4">Save Preferences</Button>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium text-red-500 mb-4">Danger Zone</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Once you delete your account, there is no going back. This action cannot be undone.
                          </p>
                          <Button variant="destructive">Delete Account</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Placeholder content for other tabs */}
                  {['notifications', 'payment'].map((tab) => (
                    <TabsContent key={tab} value={tab} className="mt-0">
                      <div className="bg-white rounded-xl border border-border p-6">
                        <h2 className="text-2xl font-semibold mb-6">
                          {tab === 'notifications' ? 'Notifications' : 'Payment Methods'}
                        </h2>
                        <div className="text-center py-12 bg-secondary/50 rounded-lg">
                          <p className="text-lg font-medium mb-1">Coming Soon</p>
                          <p className="text-muted-foreground mb-4">
                            This feature is currently under development and will be available soon.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
