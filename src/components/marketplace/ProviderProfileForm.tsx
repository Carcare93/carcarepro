import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabaseService } from '@/services/supabase-service';
import { ServiceProvider } from '@/types/supabase-models';
import { useNavigate } from 'react-router-dom';

const ProviderProfileForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<ServiceProvider>>({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    services: [],
    phone: '',
    website: '',
    verified: false,
    available_today: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const getCoordinates = async (address: string, city: string, state: string, zip: string) => {
    const fullAddress = `${address}, ${city}, ${state} ${zip}`;
    try {
      const apiKey = localStorage.getItem('googleMapsApiKey');
      if (!apiKey) {
        toast({
          variant: "destructive",
          title: "API Key Missing",
          description: "Please set your Google Maps API key in the maps section first",
        });
        return null;
      }
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        toast({
          variant: "destructive", 
          title: "Geocoding Failed",
          description: `Could not get coordinates for address: ${data.status}`,
        });
        return null;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast({
        variant: "destructive",
        title: "Geocoding Error",
        description: "Could not convert address to coordinates",
      });
      return null;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const service = e.target.value;
    if (!service) return;
    
    setFormData(prev => {
      const services = prev.services || [];
      return {
        ...prev, 
        services: services.includes(service) 
          ? services.filter(s => s !== service)
          : [...services, service]
      };
    });
  };
  
  const handleAddService = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      const service = input.value.trim();
      if (!service) return;
      
      setFormData(prev => {
        const services = prev.services || [];
        if (!services.includes(service)) {
          return { ...prev, services: [...services, service] };
        }
        return prev;
      });
      
      input.value = '';
    }
  };
  
  const handleRemoveService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: (prev.services || []).filter(s => s !== service)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please sign in to create a provider profile",
        });
        setIsLoading(false);
        return;
      }
      
      if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zip_code) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all required fields",
        });
        setIsLoading(false);
        return;
      }
      
      const coordinates = await getCoordinates(
        formData.address, 
        formData.city, 
        formData.state, 
        formData.zip_code
      );
      
      const providerData: Omit<ServiceProvider, 'id'> = {
        name: formData.name,
        description: formData.description,
        user_id: session.user.id,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        lat: coordinates?.lat,
        lng: coordinates?.lng,
        services: formData.services || [],
        rating: 0,
        review_count: 0,
        phone: formData.phone,
        website: formData.website,
        verified: formData.verified || false,
        available_today: formData.available_today || false,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zip_code,
          coordinates: coordinates ? { 
            lat: coordinates.lat, 
            lng: coordinates.lng 
          } : undefined
        }
      };
      
      const newProvider = await supabaseService.createProvider(providerData);
      
      toast({
        title: "Profile Created",
        description: "Your provider profile has been created successfully",
      });
      
      navigate('/service-explorer');
      
    } catch (error) {
      console.error("Error creating provider profile:", error);
      toast({
        variant: "destructive",
        title: "Profile Creation Failed",
        description: "Could not create your provider profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="text-2xl font-bold mb-6">Create Service Provider Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          
          <div>
            <Label htmlFor="name">Business Name</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your business name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Describe your services"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
            />
          </div>
          
          <div>
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website"
              name="website"
              type="url"
              value={formData.website || ''}
              onChange={handleInputChange}
              placeholder="https://yourbusiness.com"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Location</h3>
          
          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input 
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              placeholder="123 Main St"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input 
                id="city"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                placeholder="City"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="state">State</Label>
              <Input 
                id="state"
                name="state"
                value={formData.state || ''}
                onChange={handleInputChange}
                placeholder="State"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input 
                id="zip_code"
                name="zip_code"
                value={formData.zip_code || ''}
                onChange={handleInputChange}
                placeholder="12345"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Services</h3>
          
          <div>
            <Label htmlFor="service-input">Add Services</Label>
            <Input
              id="service-input"
              placeholder="Type a service and press Enter"
              onKeyDown={handleAddService}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {(formData.services || []).map((service, index) => (
              <div 
                key={index} 
                className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{service}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveService(service)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            ))}
            {(formData.services?.length || 0) === 0 && (
              <p className="text-sm text-muted-foreground">No services added yet</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="available_today" 
                checked={!!formData.available_today}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('available_today', checked === true)
                }
              />
              <Label htmlFor="available_today">Available Today</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="verified" 
                checked={!!formData.verified}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('verified', checked === true)
                }
              />
              <Label htmlFor="verified">Verified Business</Label>
            </div>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Profile...' : 'Create Provider Profile'}
        </Button>
      </form>
    </div>
  );
};

export default ProviderProfileForm;
