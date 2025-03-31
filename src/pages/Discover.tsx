
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Filter, List, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import refactored components
import FilterSidebar from '@/components/discover/FilterSidebar';
import ProviderCard from '@/components/discover/ProviderCard';
import MapView from '@/components/discover/MapView';
import { providers } from '@/components/discover/ProvidersData';

const Discover = () => {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Find Automotive Services</h1>
                <p className="text-muted-foreground">Browse and book from our network of trusted service providers</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('list')}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  List
                </Button>
                <Button
                  variant={view === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('map')}
                  className="gap-2"
                >
                  <MapIcon className="h-4 w-4" />
                  Map
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="gap-2 md:hidden"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Filters sidebar */}
              <FilterSidebar isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />
              
              {/* Content area */}
              <div className="flex-1">
                {view === 'list' ? (
                  <div className="space-y-6">
                    {providers.map((provider) => (
                      <ProviderCard key={provider.id} provider={provider} />
                    ))}
                  </div>
                ) : (
                  <MapView />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Discover;
