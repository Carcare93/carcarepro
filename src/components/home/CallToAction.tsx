
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CallToAction = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          
          <Button size="lg" variant="secondary" className="gap-2">
            <Search className="h-5 w-5" />
            {t('home.cta.button')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
