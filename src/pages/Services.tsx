
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { providers } from '@/components/discover/ProvidersData';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Phone, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-10">
        <h1 className="text-3xl font-bold mb-2">Our Services</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Connect with trusted auto service providers in your area.
        </p>
        
        {/* Service Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border rounded-lg hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Oil Change</h2>
              <p className="text-muted-foreground mb-4">Regular oil changes to keep your engine running smoothly.</p>
              <Badge variant="outline" className="bg-primary/10">Most Popular</Badge>
            </CardContent>
          </Card>
          <Card className="border rounded-lg hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Brake Service</h2>
              <p className="text-muted-foreground mb-4">Inspection and replacement of brake components for your safety.</p>
              <Badge variant="outline" className="bg-secondary/50">Essential</Badge>
            </CardContent>
          </Card>
          <Card className="border rounded-lg hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Tire Service</h2>
              <p className="text-muted-foreground mb-4">Rotation, replacement, and alignment for longer tire life.</p>
              <Badge variant="outline" className="bg-secondary/50">Recommended</Badge>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Service Providers</h2>
        
        {/* Service Providers */}
        <div className="space-y-6 mb-10">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-1/3 h-48 md:h-auto overflow-hidden">
                  <img 
                    src={provider.image} 
                    alt={provider.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {provider.verified && (
                      <div className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </div>
                    )}
                    
                    {provider.available_today && (
                      <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Available Today
                      </div>
                    )}
                  </div>
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
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {provider.location.address}, {provider.location.city}, {provider.location.state} {provider.location.zipCode}
                  </div>
                  
                  <div className="mt-4 mb-4">
                    <h4 className="text-sm font-medium mb-2">Available Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.services.map((service, idx) => (
                        <Badge key={idx} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Pricing:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {Object.entries(provider.pricing || {}).slice(0, 4).map(([service, price], idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{service}:</span>
                          <span className="font-medium">{price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm">
                      <span className="font-medium">Available:</span>{' '}
                      {provider.availability.join(', ')}
                    </div>
                    <Button asChild>
                      <Link to={`/discover`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/discover">View All Service Providers</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
