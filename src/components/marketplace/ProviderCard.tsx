
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface ServiceProvider {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  available: boolean;
  verified: boolean;
  services: string[];
}

interface ProviderCardProps {
  provider: ServiceProvider;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="overflow-hidden border-border">
      <div className="md:flex">
        {/* Provider image */}
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <img
            src={provider.image}
            alt={provider.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Provider details */}
        <div className="md:w-2/3 p-4 md:p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-1">{provider.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{provider.address}</span>
                <span className="mx-2">•</span>
                <span>{provider.distance}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
              <span className="font-medium">{provider.rating}</span>
              <span className="text-sm text-muted-foreground ml-1">
                ({provider.reviewCount})
              </span>
            </div>
          </div>
          
          {/* Service badges */}
          <div className="flex flex-wrap gap-2 my-4">
            {provider.services.map((service, index) => (
              <Badge key={index} variant="outline" className="bg-secondary/50">
                {service}
              </Badge>
            ))}
          </div>
          
          {/* Availability and verification badges */}
          <div className="flex flex-wrap gap-3 mt-4">
            {provider.available && (
              <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Clock className="h-3 w-3 mr-1" />
                <span>{t('services.availableToday')}</span>
              </div>
            )}
            
            {provider.verified && (
              <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>{t('services.verified')}</span>
              </div>
            )}
          </div>
          
          <CardFooter className="px-0 pt-4 pb-0 mt-2 flex justify-between items-center">
            <Link to={`/services/${provider.id}`} className="text-sm text-primary font-medium">
              View details
            </Link>
            <Button size="sm">{t('common.bookNow')}</Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default ProviderCard;
