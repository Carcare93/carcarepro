
import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const ServiceProviders = () => {
  const { t } = useTranslation();

  // Sample service providers data
  const providers = [
    {
      id: 1,
      name: "AutoCare Express",
      image: "https://images.unsplash.com/photo-1486127635871-6aa255f6de7d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.8,
      reviews: 324,
      specialty: "Full service auto repair"
    },
    {
      id: 2,
      name: "Premier Auto Service",
      image: "https://images.unsplash.com/photo-1507171945151-491b640082a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.9,
      reviews: 187,
      specialty: "Diagnostics & engine repair"
    },
    {
      id: 3,
      name: "TireWorld Plus",
      image: "https://images.unsplash.com/photo-1518295751675-2d9e4b583597?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
      rating: 4.7,
      reviews: 256,
      specialty: "Tire replacement & services"
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              {t('home.providers.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('home.providers.subtitle')}
            </p>
          </div>
          <Button variant="outline" asChild className="group">
            <a href="/services" className="flex items-center gap-2">
              {t('home.providers.viewAll')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 relative">
                <img 
                  src={provider.image} 
                  alt={provider.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{provider.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{provider.specialty}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-medium mr-1">{provider.rating}</span>
                    <span className="text-sm text-muted-foreground">({provider.reviews})</span>
                  </div>
                  <Button size="sm">
                    {t('common.bookNow')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceProviders;
