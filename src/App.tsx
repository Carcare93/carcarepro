
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/hooks/toast/toast-context";
import React from "react";
import Index from "./pages/Index";
import ServiceExplorer from "./pages/ServiceExplorer";
import Profile from "./pages/Profile";
import ProviderProfile from "./pages/ProviderProfile";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import Vehicles from "./pages/Vehicles";
import VehicleInvoices from "./pages/VehicleInvoices";
import ProviderDashboard from "./pages/ProviderDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<ServiceExplorer />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/provider-profile" element={<ProviderProfile />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/:vehicleId/invoices" element={<VehicleInvoices />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/provider" element={<ProviderDashboard />} />
              {/* Redirects for old routes */}
              <Route path="/discover" element={<Navigate to="/services" replace />} />
              <Route path="/marketplace" element={<Navigate to="/services" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </ToastProvider>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
