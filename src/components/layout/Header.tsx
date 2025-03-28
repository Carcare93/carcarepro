
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Car } from "lucide-react"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  
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
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Car<span className="text-primary">Care</span>
            </span>
          </Link>
          
          {/* Main Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={getLinkClass}>Home</NavLink>
            <NavLink to="/discover" className={getLinkClass}>Discover</NavLink>
            <NavLink to="/marketplace" className={getLinkClass}>Marketplace</NavLink>
            <NavLink to="/bookings" className={getLinkClass}>Bookings</NavLink>
          </nav>
          
          {/* User section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hidden md:block py-2 px-4 rounded-md hover:bg-secondary/50 transition-colors duration-200">
                  Profile
                </Link>
                <Button variant="outline" size="sm" className="hidden md:block" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:block py-2 px-4 rounded-md hover:bg-secondary/50 transition-colors duration-200">
                  Log In
                </Link>
                <Link to="/signup" className="hidden md:block py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors duration-200">
                  Sign Up
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
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Car className="h-4 w-4 text-primary" />
                    </div>
                    <span>Car<span className="text-primary">Care</span></span>
                  </div>
                </SheetTitle>
                <SheetDescription>
                  Explore our services and manage your car with ease.
                </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-4 text-lg font-medium mt-4">
                <Link to="/" className="hover:text-secondary" onClick={closeMobileMenu}>
                  Home
                </Link>
                <Link to="/discover" className="hover:text-secondary" onClick={closeMobileMenu}>
                  Discover
                </Link>
                 <Link to="/marketplace" className="hover:text-secondary" onClick={closeMobileMenu}>
                  Marketplace
                </Link>
                <Link to="/bookings" className="hover:text-secondary" onClick={closeMobileMenu}>
                  Bookings
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="hover:text-secondary" onClick={closeMobileMenu}>
                      Profile
                    </Link>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="hover:text-secondary" onClick={closeMobileMenu}>
                      Log In
                    </Link>
                    <Link to="/signup" className="bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90 transition-colors duration-200" onClick={closeMobileMenu}>
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <NavLink to="/" className={getLinkClass} onClick={closeMobileMenu}>Home</NavLink>
              <NavLink to="/discover" className={getLinkClass} onClick={closeMobileMenu}>Discover</NavLink>
              <NavLink to="/marketplace" className={getLinkClass} onClick={closeMobileMenu}>Marketplace</NavLink>
              <NavLink to="/bookings" className={getLinkClass} onClick={closeMobileMenu}>Bookings</NavLink>
              
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile" className={getLinkClass} onClick={closeMobileMenu}>Profile</NavLink>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>Log Out</Button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={getLinkClass} onClick={closeMobileMenu}>Log In</NavLink>
                  <NavLink to="/signup" className="bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90 transition-colors duration-200" onClick={closeMobileMenu}>Sign Up</NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
