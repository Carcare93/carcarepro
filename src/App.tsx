
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Services from '@/pages/Services';
import ServiceDetails from '@/pages/ServiceDetails';
import Blog from '@/pages/Blog';
import BlogArticle from '@/pages/BlogArticle';
import Dashboard from '@/pages/Dashboard';
import ServiceExplorer from '@/pages/ServiceExplorer';
import ProviderRegistration from '@/pages/ProviderRegistration';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import VerifyEmail from '@/pages/VerifyEmail';
import ProviderProfile from '@/pages/ProviderProfile';
import { Toaster } from '@/components/ui/toaster';

const router = createBrowserRouter([
  {
    path: "/",
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
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
