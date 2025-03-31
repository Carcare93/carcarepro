
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions or feedback? We'd love to hear from you.
          </p>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Your email" />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <Input id="subject" placeholder="How can we help?" />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <Textarea 
                id="message"
                placeholder="Tell us more about your inquiry..."
                rows={5}
              />
            </div>
            
            <Button type="submit" className="w-full md:w-auto">
              Send Message
            </Button>
          </form>
          
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Phone</h3>
                <p className="text-muted-foreground">(555) 123-4567</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Email</h3>
                <p className="text-muted-foreground">contact@autoconcierge.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
