
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProfileTab from '@/components/provider/ProfileTab';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Settings, 
  Star, 
  MapPin, 
  Phone, 
  Calendar, 
  BarChart4, 
  Users 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ProviderProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect non-providers
  useEffect(() => {
    if (!user || user.accountType !== 'provider') {
      navigate('/profile');
    }
  }, [user, navigate]);
  
  if (!user || user.accountType !== 'provider' || !user.providerProfile) {
    return null;
  }
  
  const { providerProfile } = user;
  
  const handleDashboardClick = () => {
    navigate('/provider');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Header with back button and actions */}
            <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" size="sm" onClick={handleDashboardClick}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </div>
            
            {/* Profile header */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <div className="sm:flex items-start justify-between">
                <div className="sm:flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 sm:mb-0">
                    <span className="text-2xl font-bold text-primary">
                      {providerProfile.businessName.charAt(0)}
                    </span>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-bold">{providerProfile.businessName}</h1>
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{providerProfile.rating?.toFixed(1) || '0.0'}</span>
                      <span className="text-muted-foreground ml-1">
                        ({providerProfile.reviewCount || 0} reviews)
                      </span>
                      {providerProfile.verified && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center mt-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {providerProfile.location.city}, {providerProfile.location.state}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0">
                  <Button onClick={handleDashboardClick}>
                    Manage Services
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-md mr-4">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-md mr-4">
                      <BarChart4 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold">$2,450</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-md mr-4">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Customers</p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact information */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>{providerProfile.phone || 'No phone number'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>
                    {providerProfile.location.address}, {providerProfile.location.city},{' '}
                    {providerProfile.location.state} {providerProfile.location.zipCode}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Services offered */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {providerProfile.services.map((service) => (
                  <span 
                    key={service} 
                    className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
            
            <Separator className="my-8" />
            
            {/* Business profile management */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-6">Edit Business Profile</h2>
              <ProfileTab providerProfile={providerProfile} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderProfile;
