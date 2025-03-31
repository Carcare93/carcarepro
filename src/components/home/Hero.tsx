
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative bg-gradient-to-r from-primary/10 to-background pt-24 pb-16 md:py-32 overflow-hidden">
      {/* Blurred automotive background image */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="https://images.unsplash.com/photo-1486127635871-6aa255f6de7d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
          alt="Automotive background" 
          className="w-full h-full object-cover opacity-10 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-background/70"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 font-sans">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="gap-2 transition-transform hover:scale-105 shadow-lg px-8 py-6 text-lg">
              <a href="/services">
                <Search className="h-5 w-5" />
                {t('home.hero.cta')}
              </a>
            </Button>
            
            {!isAuthenticated && (
              <Button asChild variant="outline" size="lg" className="gap-2 hover:bg-secondary/50">
                <a href="/signup">
                  <UserPlus className="h-5 w-5" />
                  {t('common.signup')}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute right-0 top-0 h-full opacity-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M0,0 L1000,0 L1000,1000 L0,0 Z" fill="url(#grad)" />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
