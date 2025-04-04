
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Instagram, Twitter, Facebook, Youtube, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    product: [
      { name: t('footer.features'), href: '#features' },
      { name: t('footer.howItWorks'), href: '#how-it-works' },
      { name: t('footer.pricing'), href: '#pricing' },
    ],
    company: [
      { name: t('footer.aboutUs'), href: '/about' },
      { name: t('footer.blog'), href: '/blog' },
      { name: t('footer.careers'), href: '/careers' },
      { name: t('footer.contact'), href: '/contact' },
    ],
    legal: [
      { name: t('footer.privacyPolicy'), href: '/privacy' },
      { name: t('footer.termsOfService'), href: '/terms' },
      { name: t('footer.cookiePolicy'), href: '/cookies' },
    ],
  };

  return (
    <footer className="bg-secondary pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/cf04f4b5-7f5b-4af0-9ee6-b8bce2bec514.png" 
                alt="CarCare Logo" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              The easiest way to find and book automotive services near you. Save time and ensure quality care for your vehicle.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {t('footer.product')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {t('footer.company')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Information */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <a href="mailto:support@carcare.com" className="hover:text-primary transition-colors">
                  support@carcare.com
                </a>
              </li>
              <li className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} CarCare. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
