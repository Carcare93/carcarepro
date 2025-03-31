
import React from 'react';
import { Search, Calendar, FileText, Car } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: t('home.features.discover.title'),
      description: t('home.features.discover.description')
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: t('home.features.book.title'),
      description: t('home.features.book.description')
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: t('home.features.track.title'),
      description: t('home.features.track.description')
    },
    {
      icon: <Car className="h-10 w-10 text-primary" />,
      title: t('home.features.manage.title'),
      description: t('home.features.manage.description')
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {t('home.features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white border border-border rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/10 rounded-full mb-6 inline-flex">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
