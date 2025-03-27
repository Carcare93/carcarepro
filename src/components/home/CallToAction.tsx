
import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Car, Calendar, Settings, Star, ChevronRight } from 'lucide-react';

const CallToAction = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const benefits = [
    {
      icon: <Car className="h-5 w-5 text-white" />,
      title: "Find the Right Service",
      description: "Quickly locate the best service providers for your specific vehicle needs."
    },
    {
      icon: <Calendar className="h-5 w-5 text-white" />,
      title: "Book Instantly",
      description: "Schedule appointments with just a few taps at times that work for you."
    },
    {
      icon: <Settings className="h-5 w-5 text-white" />,
      title: "Track Your Vehicle",
      description: "Keep a complete history of all services performed on your vehicles."
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={ref}
          className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-blue-600 shadow-xl relative"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out'
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzBoLTYgdi02aDZ2NnptMCAxMmgtNnY2aDZ2LTZ6bTEyLTEyaC02djZoNnYtNnptMC0xMmgtNnY2aDZ2LTZ6bTAtMTJoLTZ2Nmg2di02em0tMTIgMGgtNnY2aDZ2LTZ6bS0xMiAwSDEydjZoNnYtNnptMCAxMkgxMnY2aDZ2LTZ6bTAgMTJIMTJ2Nmg2di02em0xMiAwSDI0djZoNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
          </div>

          <div className="relative z-10 py-16 px-8 md:p-16">
            <div className="flex flex-col md:flex-row gap-12 justify-between items-center">
              <div className="max-w-xl">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-white/20 text-white mb-6">
                  Get Started Today
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
                  Your vehicle deserves the best care possible
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Join thousands of satisfied users who have simplified their automotive care with CarCare. Create your account now and experience hassle-free car maintenance.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup">
                    <Button size="lg" variant="secondary" className="relative overflow-hidden group">
                      <span className="relative z-10">Create Free Account</span>
                      <span className="absolute inset-0 bg-black/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </Button>
                  </Link>
                  <Link to="/discover">
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 group">
                      <span>Explore Services</span>
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                        <p className="text-white/80 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
