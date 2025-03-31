
import React, { useState } from 'react';
import { Filter, List, MapIcon, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import ServiceMap from '@/components/marketplace/ServiceMap';
import ServiceList from '@/components/marketplace/ServiceList';
import FilterSidebar from '@/components/marketplace/FilterSidebar';
import LocationSearch from '@/components/marketplace/LocationSearch';
import ProviderCard from '@/components/marketplace/ProviderCard';
import { useServiceProviders } from '@/hooks/useServiceProviders';
import { useTranslation } from 'react-i18next';

const ServiceExplorer = () => {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [location, setLocation] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();
  const { providers, isLoading } = useServiceProviders(location);
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Searching services",
      description: `Finding automotive services near ${location || 'your location'}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{t('services.title')}</h1>
                <p className="text-muted-foreground">{t('services.subtitle')}</p>
              </div>
              
              <div className="w-full md:w-auto">
                <LocationSearch 
                  location={location}
                  setLocation={setLocation}
                  handleSearch={handleSearch}
                />
              </div>
            </div>
            
            <Tabs defaultValue="list" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="list" onClick={() => setView('list')}>
                    <List className="h-4 w-4 mr-2" />
                    {t('services.listView')}
                  </TabsTrigger>
                  <TabsTrigger value="map" onClick={() => setView('map')}>
                    <MapIcon className="h-4 w-4 mr-2" />
                    {t('services.mapView')}
                  </TabsTrigger>
                </TabsList>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="md:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t('services.filters')}
                </Button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Filters sidebar */}
                <FilterSidebar 
                  isFilterOpen={isFilterOpen} 
                  setIsFilterOpen={setIsFilterOpen} 
                />
                
                {/* Content area */}
                <div className="flex-1">
                  <TabsContent value="list" className="mt-0">
                    {view === 'list' && (
                      <div className="space-y-6">
                        {isLoading ? (
                          // Show skeletons when loading
                          <div>{t('services.loading')}</div>
                        ) : providers && providers.length > 0 ? (
                          // Show providers list with type checking
                          providers.map((provider) => {
                            if (provider && provider.id) {
                              return <ProviderCard key={provider.id} provider={provider} />;
                            }
                            return null;
                          })
                        ) : (
                          // Show empty state
                          <div className="text-center py-12">
                            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-medium mb-2">{t('services.noProvidersFound')}</h3>
                            <p className="text-muted-foreground">
                              {t('services.tryAdjusting')}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="map" className="mt-0">
                    <ServiceMap providers={providers || []} isLoading={isLoading} />
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
