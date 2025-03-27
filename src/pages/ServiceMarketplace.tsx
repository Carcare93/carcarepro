
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Filter, List, MapIcon, Car, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServiceMap from '@/components/marketplace/ServiceMap';
import ServiceList from '@/components/marketplace/ServiceList';
import { useToast } from '@/hooks/use-toast';
import { carService, ServiceProvider } from '@/services/car-service';

const ServiceMarketplace = () => {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [location, setLocation] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: providers = [], isLoading, error } = useQuery({
    queryKey: ['serviceProviders', location],
    queryFn: async () => {
      // If no location provided, use mock data
      if (!location) return mockProviders;
      try {
        return await carService.getServiceProviders(location);
      } catch (error) {
        // Fall back to mock data if API call fails
        console.error('Error fetching service providers:', error);
        return mockProviders;
      }
    },
  });

  useEffect(() => {
    // Check if geolocation is available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For demonstration purposes, we're just showing a toast
          // In a real app, this would be used to fetch nearby providers
          toast({
            title: "Location accessed",
            description: "We can now show you nearby service providers.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Location access denied",
            description: "Please enter your location manually to find services near you.",
          });
        }
      );
    }
  }, [toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Searching services",
      description: `Finding automotive services near ${location || 'your location'}`,
    });
  };

  const mockProviders = [
    {
      id: "1",
      name: "AutoCare Express",
      location: {
        address: "123 Main Street",
        city: "Metropolis",
        state: "NY",
        zipCode: "10001",
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      services: ["Oil Change", "Brake Repair", "Tire Replacement", "Wheel Alignment"],
      rating: 4.8,
      reviewCount: 324,
      phone: "(555) 123-4567"
    },
    {
      id: "2",
      name: "Premier Auto Service",
      location: {
        address: "456 Oak Avenue",
        city: "Metropolis",
        state: "NY",
        zipCode: "10002",
        coordinates: { lat: 40.7148, lng: -74.0068 }
      },
      services: ["Engine Diagnostics", "Engine Repair", "Electrical System Repair", "Battery Replacement"],
      rating: 4.9,
      reviewCount: 187,
      phone: "(555) 234-5678"
    },
    {
      id: "3",
      name: "TireWorld Plus",
      location: {
        address: "789 Pine Street",
        city: "Metropolis",
        state: "NY",
        zipCode: "10003",
        coordinates: { lat: 40.7117, lng: -74.0045 }
      },
      services: ["Tire Sales", "Tire Installation", "Wheel Alignment", "Tire Pressure Monitoring"],
      rating: 4.7,
      reviewCount: 256,
      phone: "(555) 345-6789"
    },
    {
      id: "4",
      name: "Eastside Mechanics",
      location: {
        address: "321 Elm Street",
        city: "Metropolis",
        state: "NY",
        zipCode: "10004",
        coordinates: { lat: 40.7155, lng: -74.0090 }
      },
      services: ["AC Repair", "State Inspection", "Full Service", "Suspension Repair"],
      rating: 4.6,
      reviewCount: 142,
      phone: "(555) 456-7890"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Service Marketplace</h1>
                <p className="text-muted-foreground">Find and book automotive services near you</p>
              </div>
              
              <div className="w-full md:w-auto">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-grow">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Enter your location..." 
                      className="pl-9 pr-4 py-2" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </div>
            </div>
            
            <Tabs defaultValue="list" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="list" onClick={() => setView('list')}>
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </TabsTrigger>
                  <TabsTrigger value="map" onClick={() => setView('map')}>
                    <MapIcon className="h-4 w-4 mr-2" />
                    Map View
                  </TabsTrigger>
                </TabsList>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="md:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Filters sidebar - hidden on mobile unless toggled */}
                <div 
                  className={`bg-white rounded-xl border border-border p-5 mb-6 md:mb-0 md:w-72 shrink-0 ${
                    isFilterOpen ? 'block' : 'hidden md:block'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)} className="md:hidden">
                      Close
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Service type filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Service Type</label>
                      <div className="space-y-2">
                        {['Oil Change', 'Tire Services', 'Brakes', 'Engine Repair', 'Diagnostics'].map((service) => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox id={service.toLowerCase().replace(' ', '-')} />
                            <label
                              htmlFor={service.toLowerCase().replace(' ', '-')}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {service}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Distance filter */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Distance</label>
                        <span className="text-xs">10 miles</span>
                      </div>
                      <Slider defaultValue={[10]} max={50} step={1} />
                    </div>
                    
                    {/* Rating filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Rating</label>
                      <Select defaultValue="4">
                        <SelectTrigger>
                          <SelectValue placeholder="Minimum Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Stars & Up</SelectItem>
                          <SelectItem value="4">4 Stars & Up</SelectItem>
                          <SelectItem value="3">3 Stars & Up</SelectItem>
                          <SelectItem value="2">2 Stars & Up</SelectItem>
                          <SelectItem value="1">1 Star & Up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Availability filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Availability</label>
                      <Select defaultValue="any">
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any time</SelectItem>
                          <SelectItem value="today">Available today</SelectItem>
                          <SelectItem value="tomorrow">Available tomorrow</SelectItem>
                          <SelectItem value="week">Available this week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button className="w-full">Apply Filters</Button>
                  </div>
                </div>
                
                {/* Content area */}
                <div className="flex-1">
                  <TabsContent value="list" className="mt-0">
                    <ServiceList providers={providers} isLoading={isLoading} />
                  </TabsContent>
                  <TabsContent value="map" className="mt-0">
                    <ServiceMap providers={providers} isLoading={isLoading} />
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceMarketplace;
