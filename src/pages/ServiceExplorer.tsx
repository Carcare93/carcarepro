
import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useServiceProviders } from '@/hooks/useServiceProviders';
import { ServiceProvider } from '@/types/supabase-models';

export default function ServiceExplorer() {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [location, setLocation] = useState('');
  const [filters, setFilters] = useState({
    service: '',
    rating: 0,
    distance: 50,
    open: false,
    verified: false
  });
  
  // Use the custom hook to fetch providers
  const { providers, isLoading } = useServiceProviders(location);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    // Location state is already set by the LocationSearch component
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  // Apply filters to providers
  const filteredProviders = Array.isArray(providers) ? providers.filter((provider) => {
    // Filter by service type
    if (filters.service && provider.services && !provider.services.includes(filters.service)) {
      return false;
    }
    
    // Filter by minimum rating
    if (filters.rating > 0 && (provider.rating || 0) < filters.rating) {
      return false;
    }
    
    // Filter by verified status - handle undefined values
    if (filters.verified && provider.verified !== true) {
      return false;
    }
    
    // Filter by availability - handle undefined values
    if (filters.open && provider.available_today !== true) {
      return false;
    }
    
    return true;
  }) : [];

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
          <LocationSearch 
            location={location} 
            setLocation={setLocation} 
            handleSearch={handleSearch} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {showFilters && (
            <div className="lg:col-span-3">
              <FilterSidebar 
                isFilterOpen={showFilters} 
                setIsFilterOpen={setShowFilters}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
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
                ) : filteredProviders.length > 0 ? (
                  <ServiceList providers={filteredProviders} isLoading={isLoading} />
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
                  <ServiceMap providers={filteredProviders} isLoading={isLoading} />
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
