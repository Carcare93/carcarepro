
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Car, Calendar, Settings, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper function to animate elements when they come into view
const useIntersectionObserver = (
  elementRef: React.RefObject<HTMLElement>,
  { threshold = 0.1, root = null, rootMargin = '0px' } = {}
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      },
      { threshold, root, rootMargin }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [elementRef, threshold, root, rootMargin]);
};

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(titleRef);
  useIntersectionObserver(subtitleRef);
  useIntersectionObserver(ctaRef);
  useIntersectionObserver(imageRef);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary to-background z-0" />
      <div className="absolute top-96 -left-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-64 -right-96 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Hero Copy */}
          <div>
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6 animate-slide-down">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Your car deserves the best care
            </div>
            
            <h1 
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance leading-tight animate-enter"
            >
              Find and book <span className="text-primary">automotive services</span> near you
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-xl leading-relaxed text-foreground/80 mb-8 max-w-xl animate-enter"
            >
              CarCare connects you with trusted service providers for all your car maintenance needs - from oil changes and tire replacements to full servicing.
            </p>
            
            <div 
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-4 animate-enter"
            >
              <Link to="/discover">
                <Button size="lg" className="relative overflow-hidden group">
                  <span className="relative z-10">Find Services</span>
                  <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="group">
                  <span>Create Account</span>
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-12">
              {[
                { icon: <Car className="h-5 w-5 text-primary" />, text: "Trusted mechanics" },
                { icon: <Calendar className="h-5 w-5 text-primary" />, text: "Easy booking" },
                { icon: <Settings className="h-5 w-5 text-primary" />, text: "Complete services" },
                { icon: <Star className="h-5 w-5 text-primary" />, text: "Verified reviews" }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-border shadow-sm"
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Hero Image */}
          <div 
            ref={imageRef}
            className="relative h-[500px] animate-enter"
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              {/* Image container */}
              <div className="relative w-full h-full p-4">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transform perspective-1000 rotateY-3 rotateX-3">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Car mechanic servicing a vehicle" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                
                {/* Floating cards */}
                <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-lg shadow-lg max-w-xs animate-slide-up">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Oil Change Appointment</h4>
                      <p className="text-xs text-foreground/70">Tomorrow at 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">Confirmed</span>
                    <span className="text-xs text-foreground/70">$49.99</span>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 glass-card p-4 rounded-lg shadow-lg max-w-xs animate-slide-down">
                  <div className="flex mb-2">
                    <div className="mr-2 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="h-4 w-4 text-yellow-400 fill-yellow-400" 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium">5.0</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Fast and professional service</h4>
                  <p className="text-xs text-foreground/70 mb-2">The mechanic was very knowledgeable and fixed my car quickly.</p>
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-gray-300 mr-2"></div>
                    <span className="text-xs font-medium">Sarah J.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
