
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">About CarCare</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl mb-6">
                CarCare was founded with a simple mission: to make automotive care accessible, 
                transparent, and stress-free for everyone.
              </p>
              
              <h2 className="text-2xl font-semibold mt-10 mb-4">Our Mission</h2>
              <p>
                We believe that maintaining your vehicle shouldn't be complicated or stressful. 
                Our platform connects car owners with trusted service providers, making it easy 
                to find, book, and manage automotive services all in one place.
              </p>
              
              <h2 className="text-2xl font-semibold mt-10 mb-4">Our Values</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Transparency:</strong> No hidden fees or surprise costs, ever.</li>
                <li><strong>Reliability:</strong> We carefully vet all service providers on our platform.</li>
                <li><strong>Simplicity:</strong> Easy-to-use tools that save you time and headaches.</li>
                <li><strong>Accessibility:</strong> Automotive care should be available to everyone.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-10 mb-4">Our Team</h2>
              <p>
                CarCare is powered by a passionate team of automotive enthusiasts, technology experts, 
                and customer service professionals dedicated to revolutionizing the automotive service industry.
              </p>
              
              <div className="mt-12 p-6 bg-secondary/30 rounded-lg border border-border">
                <h3 className="text-xl font-medium mb-3">Contact Us</h3>
                <p>Have questions or suggestions? We'd love to hear from you!</p>
                <p className="mt-4">
                  <strong>Email:</strong> support@carcare.example.com<br />
                  <strong>Phone:</strong> (555) 123-4567<br />
                  <strong>Hours:</strong> Monday-Friday, 9am-5pm EST
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
