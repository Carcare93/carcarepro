
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Star, MapPin, Clock, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProviderCardProps {
  provider: {
    id: string;
    name: string;
    image: string;
    rating: number;
    reviewCount: number;
    location: string;
    specialties: string[];
    verified: boolean;
    availableToday: boolean;
  };
  index: number;
}

const ProviderCard = ({ provider, index }: ProviderCardProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.5s ease-out ${index * 100}ms`
      }}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={provider.image} 
          alt={provider.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {provider.verified && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
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
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{provider.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-sm font-medium">{provider.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">({provider.reviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {provider.location}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-5">
          {provider.specialties.map((specialty, idx) => (
            <span 
              key={idx} 
              className="text-xs bg-secondary px-2 py-1 rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>
        
        <Link to={`/provider/${provider.id}`}>
          <Button variant="outline" className="w-full group">
            View Details
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

const ServiceProviders = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const providers = [
    {
      id: "1",
      name: "AutoCare Express",
      image: "https://images.unsplash.com/photo-1632823469850-2f77dd9c7c93?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.8,
      reviewCount: 324,
      location: "Downtown, 2.3 miles away",
      specialties: ["Oil Change", "Brakes", "Tires"],
      verified: true,
      availableToday: true,
    },
    {
      id: "2",
      name: "Premier Auto Service",
      image: "https://images.unsplash.com/photo-1629384997254-86acaa07dbaa?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.9,
      reviewCount: 187,
      location: "West End, 3.1 miles away",
      specialties: ["Diagnostics", "Engine Repair", "Electrical"],
      verified: true,
      availableToday: false,
    },
    {
      id: "3",
      name: "TireWorld Plus",
      image: "https://images.unsplash.com/photo-1486127635871-6aa255f6de7d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.7,
      reviewCount: 256,
      location: "South Side, 1.8 miles away",
      specialties: ["Tire Replacement", "Alignment", "Rotation"],
      verified: false,
      availableToday: true,
    },
    {
      id: "4",
      name: "Eastside Mechanics",
      image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.6,
      reviewCount: 142,
      location: "East Village, 4.2 miles away",
      specialties: ["Full Service", "Inspection", "AC Repair"],
      verified: true,
      availableToday: true,
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={ref}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out'
          }}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
              Top-rated Providers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover trusted service providers
            </h2>
            <p className="text-lg text-muted-foreground">
              Browse our network of certified mechanics and service centers, all vetted for quality and reliability.
            </p>
          </div>
          <Link to="/discover">
            <Button size="lg" className="relative overflow-hidden group">
              <span className="relative z-10">View All Providers</span>
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map((provider, index) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-40 -right-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 -left-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    </section>
  );
};

export default ServiceProviders;
