
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProviderCard from '@/components/marketplace/ProviderCard';
import FilterSidebar from '@/components/marketplace/FilterSidebar';
import LocationSearch from '@/components/marketplace/LocationSearch';
import ServiceMap from '@/components/marketplace/ServiceMap';
import ServiceList from '@/components/marketplace/ServiceList';
import EmptyState from '@/components/shared/EmptyState';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench, Map, List, SlidersHorizontal } from 'lucide-react';
import { getServiceProviders } from '@/services/car-service';
import { useQuery } from '@tanstack/react-query';

// Define a separate interface for the component instead of reusing the imported type
interface ServiceProvider {
  id: string;
  name: string;
  services: string[];
  rating: number;
  reviewCount: number;
  image: string;
  distance: string;
  address: string;
  available: boolean;
  verified: boolean;
}

export default function ServiceExplorer() {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState({
    service: '',
    rating: 0,
    distance: 50,
    open: false,
    verified: false
  });
  
  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['serviceProviders'],
    queryFn: getServiceProviders
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Apply filters to providers
  const filteredProviders = providers.filter((provider: any) => {
    // Filter by service type
    if (filters.service && !provider.services.includes(filters.service)) {
      return false;
    }
    
    // Filter by minimum rating
    if (filters.rating > 0 && provider.rating < filters.rating) {
      return false;
    }
    
    // Filter by verified status
    if (filters.verified && !provider.verified) {
      return false;
    }
    
    // Filter by availability
    if (filters.open && !provider.available) {
      return false;
    }
    
    return true;
  });
  
  // Map the providers to match our component's expected ServiceProvider interface
  const mappedProviders: ServiceProvider[] = filteredProviders.map((provider: any) => ({
    id: provider.id,
    name: provider.name,
    services: provider.services,
    rating: provider.rating,
    reviewCount: provider.reviewCount,
    image: provider.image || '/placeholder.svg',
    distance: provider.distance || '5 miles',
    address: provider.location?.address || 'Unknown location',
    available: provider.available || true,
    verified: provider.verified || false
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('serviceExplorer.title', 'Auto Service Providers')}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFilters}
              className="flex items-center gap-1 md:gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden md:inline">{t('serviceExplorer.filters', 'Filters')}</span>
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <LocationSearch />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {showFilters && (
            <div className="lg:col-span-3">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>
          )}
          
          <div className={`${showFilters ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
            <Tabs defaultValue="list" className="mb-6" onValueChange={(value) => setView(value as 'list' | 'map')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  {t('serviceExplorer.listView', 'List View')}
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  {t('serviceExplorer.mapView', 'Map View')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="mt-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">{t('serviceExplorer.loading', 'Loading service providers...')}</p>
                  </div>
                ) : mappedProviders.length > 0 ? (
                  <ServiceList providers={mappedProviders} />
                ) : (
                  <EmptyState
                    icon={<Wrench className="h-12 w-12" />}
                    title={t('serviceExplorer.noResults', 'No service providers found')}
                    description={t('serviceExplorer.tryDifferent', 'Try changing your filters or location')}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="map" className="mt-4">
                <div className="h-[70vh] rounded-xl overflow-hidden">
                  <ServiceMap providers={mappedProviders} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
