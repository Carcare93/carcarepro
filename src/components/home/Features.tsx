
import React, { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Search, Calendar, Star, Car, Settings, Clock, CreditCard, Bell } from 'lucide-react';

interface FeatureCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all relative overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.5s ease-out ${delay}ms`
      }}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
      <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-primary/5 rounded-full" />
    </div>
  );
};

const Features = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const features = [
    {
      icon: <Search className="h-5 w-5 text-primary" />,
      title: "Find Nearby Services",
      description: "Discover automotive service providers close to you with our interactive map and search tools."
    },
    {
      icon: <Calendar className="h-5 w-5 text-primary" />,
      title: "Easy Online Booking",
      description: "Schedule appointments with just a few clicks, selecting your preferred date and time."
    },
    {
      icon: <Star className="h-5 w-5 text-primary" />,
      title: "Reviews & Ratings",
      description: "Read verified customer reviews and see ratings to choose the best service providers."
    },
    {
      icon: <Car className="h-5 w-5 text-primary" />,
      title: "Vehicle Profiles",
      description: "Store your vehicles' details and track their complete service history in one place."
    },
    {
      icon: <Settings className="h-5 w-5 text-primary" />,
      title: "Comprehensive Services",
      description: "From oil changes to major repairs, find all the services your vehicle needs."
    },
    {
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      title: "Secure Payment",
      description: "Pay online securely or choose to pay at the service center after your appointment."
    },
    {
      icon: <Bell className="h-5 w-5 text-primary" />,
      title: "Reminders & Alerts",
      description: "Get timely notifications for upcoming appointments and maintenance schedules."
    },
    {
      icon: <Clock className="h-5 w-5 text-primary" />,
      title: "Real-time Updates",
      description: "Stay informed with real-time status updates on your vehicle's service progress."
    }
  ];

  return (
    <section id="features" className="py-20 bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={ref}
          className="max-w-3xl mx-auto text-center mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out'
          }}
        >
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Everything you need to manage your car's maintenance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            CarCare simplifies finding, booking, and managing automotive services with a comprehensive set of features designed to save you time and ensure your vehicle gets the best care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-40 -left-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 -right-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    </section>
  );
};

export default Features;
