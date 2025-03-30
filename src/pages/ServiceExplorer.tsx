
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
import { useToast } from '@/hooks/use-toast';
import { carService } from '@/services/car-service';

// Import components from the marketplace
import ServiceMap from '@/components/marketplace/ServiceMap';
import ServiceList from '@/components/marketplace/ServiceList';

const ServiceExplorer = () => {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [location, setLocation] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();
  
  // Sample service providers data (combined from both pages)
  const mockProviders = [
    {
      id: "1",
      name: "AutoCare Express",
      image: "https://images.unsplash.com/photo-1632823469850-2f77dd9c7c93?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.8,
      reviewCount: 324,
      location: {
        address: "123 Main Street, Downtown",
        city: "Metropolis",
        state: "NY",
        zipCode: "10001",
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      specialties: ["Oil Change", "Brakes", "Tires"],
      services: ["Oil Change", "Brake Repair", "Tire Replacement", "Wheel Alignment"],
      availability: ["Today", "Tomorrow", "Wednesday"],
      pricing: {
        "Oil Change": "$49.99",
        "Brake Inspection": "Free",
        "Brake Pad Replacement": "$180.00",
        "Tire Rotation": "$25.00"
      },
      verified: true,
      availableToday: true,
      phone: "(555) 123-4567"
    },
    {
      id: "2",
      name: "Premier Auto Service",
      image: "https://images.unsplash.com/photo-1629384997254-86acaa07dbaa?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.9,
      reviewCount: 187,
      location: {
        address: "456 Oak Avenue, West End",
        city: "Metropolis",
        state: "NY",
        zipCode: "10002",
        coordinates: { lat: 40.7148, lng: -74.0068 }
      },
      specialties: ["Diagnostics", "Engine Repair", "Electrical"],
      services: ["Engine Diagnostics", "Engine Repair", "Electrical System Repair", "Battery Replacement"],
      availability: ["Tomorrow", "Thursday", "Friday"],
      pricing: {
        "Check Engine Light Diagnosis": "$89.99",
        "Battery Replacement": "$149.99",
        "Alternator Replacement": "$350.00",
        "Starter Replacement": "$275.00"
      },
      verified: true,
      availableToday: false,
      phone: "(555) 234-5678"
    },
    {
      id: "3",
      name: "TireWorld Plus",
      image: "https://images.unsplash.com/photo-1486127635871-6aa255f6de7d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.7,
      reviewCount: 256,
      location: {
        address: "789 Pine Street, South Side",
        city: "Metropolis",
        state: "NY",
        zipCode: "10003",
        coordinates: { lat: 40.7117, lng: -74.0045 }
      },
      specialties: ["Tire Replacement", "Alignment", "Rotation"],
      services: ["Tire Sales", "Tire Installation", "Wheel Alignment", "Tire Pressure Monitoring"],
      availability: ["Today", "Tomorrow", "Friday"],
      pricing: {
        "Tire Installation (per tire)": "$20.00",
        "Wheel Alignment": "$89.99",
        "Tire Rotation": "$29.99",
        "Tire Pressure Monitoring System Service": "$49.99"
      },
      verified: false,
      availableToday: true,
      phone: "(555) 345-6789"
    },
    {
      id: "4",
      name: "Eastside Mechanics",
      image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.6,
      reviewCount: 142,
      location: {
        address: "321 Elm Street, East Village",
        city: "Metropolis",
        state: "NY",
        zipCode: "10004",
        coordinates: { lat: 40.7155, lng: -74.0090 }
      },
      specialties: ["Full Service", "Inspection", "AC Repair"],
      services: ["AC Repair", "State Inspection", "Full Service", "Suspension Repair"],
      availability: ["Today", "Thursday", "Friday"],
      pricing: {
        "AC System Check": "$59.99",
        "AC Recharge": "$119.99",
        "State Inspection": "$39.99",
        "Suspension Inspection": "$49.99"
      },
      verified: true,
      availableToday: true,
      phone: "(555) 456-7890"
    },
    {
      id: "5",
      name: "North Star Auto",
      image: "https://images.unsplash.com/photo-1518295751675-2d9e4b583597?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.5,
      reviewCount: 98,
      location: {
        address: "555 Maple Drive, North District",
        city: "Metropolis",
        state: "NY",
        zipCode: "10005",
        coordinates: { lat: 40.7210, lng: -74.0050 }
      },
      specialties: ["Oil Change", "Transmission", "Cooling System"],
      services: ["Oil Change", "Transmission Service", "Cooling System Flush", "Radiator Replacement"],
      availability: ["Tomorrow", "Wednesday", "Thursday"],
      pricing: {
        "Synthetic Oil Change": "$69.99",
        "Transmission Fluid Change": "$149.99",
        "Cooling System Flush": "$109.99",
        "Radiator Inspection": "$29.99"
      },
      verified: true,
      availableToday: false,
      phone: "(555) 567-8910"
    },
    {
      id: "6",
      name: "City Central Repairs",
      image: "https://images.unsplash.com/photo-1507171945151-491b640082a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.4,
      reviewCount: 211,
      location: {
        address: "888 Broadway, City Center",
        city: "Metropolis",
        state: "NY",
        zipCode: "10006",
        coordinates: { lat: 40.7190, lng: -74.0075 }
      },
      specialties: ["Brakes", "Suspension", "Steering"],
      services: ["Brake Service", "Suspension Repair", "Steering System", "Wheel Balancing"],
      availability: ["Today", "Wednesday", "Friday"],
      pricing: {
        "Brake Pad Replacement (Front)": "$169.99",
        "Brake Fluid Flush": "$89.99",
        "Strut Replacement": "$350.00/pair",
        "Wheel Balancing": "$49.99"
      },
      verified: false,
      availableToday: true,
      phone: "(555) 678-9012"
    }
  ];

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

  // Provider card component
  const ProviderCard = ({ provider }: { provider: any }) => (
    <div className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all group animate-fade-in">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/3 h-48 md:h-auto overflow-hidden">
          {provider.image ? (
            <img 
              src={provider.image} 
              alt={provider.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <Car className="h-16 w-16 text-primary/30" />
            </div>
          )}
          
          {provider.verified && (
            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
              <Star className="h-3 w-3 mr-1 fill-white" />
              Verified
            </div>
          )}
          {provider.availableToday && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Available Today
            </div>
          )}
        </div>
        
        <div className="p-6 md:w-2/3">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold">{provider.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-sm font-medium">{provider.rating}</span>
              <span className="text-xs text-muted-foreground ml-1">({provider.reviewCount})</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            {provider.location.address ? 
              `${provider.location.address}, ${provider.location.city}` : 
              provider.location}
          </div>
          
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Services:</p>
            <div className="flex flex-wrap gap-2">
              {provider.services.slice(0, 4).map((service: string, idx: number) => (
                <span 
                  key={idx} 
                  className="text-xs bg-secondary px-2 py-1 rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm">
              <span className="font-medium">Available:</span>{' '}
              {provider.availability.join(', ')}
            </div>
            <Button>
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Find Automotive Services</h1>
                <p className="text-muted-foreground">Browse, search and book trusted service providers near you</p>
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
                    {view === 'list' && (
                      <div className="space-y-6">
                        {isLoading ? (
                          // Show skeletons when loading
                          <div>Loading providers...</div>
                        ) : providers.length > 0 ? (
                          // Show providers list
                          providers.map((provider) => (
                            <ProviderCard key={provider.id} provider={provider} />
                          ))
                        ) : (
                          // Show empty state
                          <div className="text-center py-12">
                            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-medium mb-2">No service providers found</h3>
                            <p className="text-muted-foreground">
                              Try adjusting your search criteria or location to find more results.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
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

export default ServiceExplorer;
