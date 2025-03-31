
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import LanguageSwitcher from '../shared/LanguageSwitcher';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const isProvider = user?.accountType === 'provider';
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    closeMobileMenu();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };
  
  const getProfilePath = () => {
    return isProvider ? '/provider-profile' : '/profile';
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `block py-2 px-4 rounded-md transition-colors duration-200 ${
      isActive ? 'bg-secondary text-foreground' : 'hover:bg-secondary/50'
    }`;
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md z-50 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/cf04f4b5-7f5b-4af0-9ee6-b8bce2bec514.png" 
              alt="CarCare Logo" 
              className="h-12 w-auto"
            />
          </Link>
          
          {/* Main Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={getLinkClass}>{t('header.home')}</NavLink>
            {!isProvider && (
              <>
                <NavLink to="/services" className={getLinkClass}>{t('header.services')}</NavLink>
                <NavLink to="/bookings" className={getLinkClass}>{t('header.bookings')}</NavLink>
              </>
            )}
          </nav>
          
          {/* User section */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <>
                {isProvider && (
                  <Link to="/provider" className="hidden md:block py-2 px-4 rounded-md hover:bg-secondary/50 transition-colors duration-200">
                    {t('header.providerDashboard')}
                  </Link>
                )}
                <Link to={getProfilePath()} className="hidden md:block py-2 px-4 rounded-md hover:bg-secondary/50 transition-colors duration-200">
                  {t('common.profile')}
                </Link>
                <Button variant="outline" size="sm" className="hidden md:block" onClick={handleLogout}>
                  {t('common.logout')}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:block py-2 px-4 rounded-md hover:bg-secondary/50 transition-colors duration-200">
                  {t('common.login')}
                </Link>
                <Link to="/signup" className="hidden md:block py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors duration-200">
                  {t('common.signup')}
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center">
                    <img 
                      src="/lovable-uploads/cf04f4b5-7f5b-4af0-9ee6-b8bce2bec514.png" 
                      alt="CarCare Logo" 
                      className="h-10 w-auto"
                    />
                  </div>
                </SheetTitle>
                <SheetDescription>
                  Explore our services and manage your car with ease.
                </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-4 text-lg font-medium mt-4">
                <Link to="/" className="hover:text-secondary" onClick={closeMobileMenu}>
                  {t('header.home')}
                </Link>
                {!isProvider && (
                  <>
                    <Link to="/services" className="hover:text-secondary" onClick={closeMobileMenu}>
                      {t('header.services')}
                    </Link>
                    <Link to="/bookings" className="hover:text-secondary" onClick={closeMobileMenu}>
                      {t('header.bookings')}
                    </Link>
                  </>
                )}
                {isAuthenticated ? (
                  <>
                    {isProvider && (
                      <Link to="/provider" className="hover:text-secondary" onClick={closeMobileMenu}>
                        {t('header.providerDashboard')}
                      </Link>
                    )}
                    <Link to={getProfilePath()} className="hover:text-secondary" onClick={closeMobileMenu}>
                      {t('common.profile')}
                    </Link>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                      {t('common.logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="hover:text-secondary" onClick={closeMobileMenu}>
                      {t('common.login')}
                    </Link>
                    <Link to="/signup" className="bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90 transition-colors duration-200" onClick={closeMobileMenu}>
                      {t('common.signup')}
                    </Link>
                  </>
                )}
                <div className="pt-2 flex justify-center">
                  <LanguageSwitcher />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
