
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Home from '@/pages/Home';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Services from '@/pages/Services';
import ServiceDetails from '@/pages/ServiceDetails';
import ServiceReservation from '@/pages/ServiceReservation';
import Blog from '@/pages/Blog';
import BlogArticle from '@/pages/BlogArticle';
import Dashboard from '@/pages/Dashboard';
import ServiceExplorer from '@/pages/ServiceExplorer';
import Discover from '@/pages/Discover';
import ProviderRegistration from '@/pages/ProviderRegistration';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import VerifyEmail from '@/pages/VerifyEmail';
import ProviderProfile from '@/pages/ProviderProfile';
import ProviderDashboard from '@/pages/ProviderDashboard';
import Profile from '@/pages/Profile';
import Bookings from '@/pages/Bookings';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';

// Create a root layout that wraps all routes with the AuthProvider
const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
};

// Create router with all routes
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/service-details/:serviceId",
        element: <ServiceDetails />,
      },
      {
        path: "/service-reservation/:serviceId",
        element: <ServiceReservation />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/blog/:articleId",
        element: <BlogArticle />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/service-explorer",
        element: <ServiceExplorer />,
      },
      {
        path: "/discover",
        element: <Discover />,
      },
      {
        path: "/provider",
        element: <ProviderDashboard />,
      },
      {
        path: "/provider-registration",
        element: <ProviderRegistration />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/provider-profile",
        element: <ProviderProfile />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/bookings",
        element: <Bookings />,
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
