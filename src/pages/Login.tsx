
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fillCustomerCredentials = () => {
    form.setValue('email', 'test.customer@example.com');
    form.setValue('password', 'password123');
  };

  const fillProviderCredentials = () => {
    form.setValue('email', 'test.provider@example.com');
    form.setValue('password', 'password123');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your CarCare account
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-xl p-8 border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="you@example.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="********" 
                            className="pl-10 pr-10" 
                            {...field} 
                          />
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-1 top-1 h-8 w-8 p-0"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" size="lg">
                  Sign in
                  <LogIn className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Accounts</CardTitle>
              <CardDescription>Use these accounts for testing the application</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="customer">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                  <TabsTrigger value="provider">Provider</TabsTrigger>
                </TabsList>
                <TabsContent value="customer" className="p-4">
                  <p className="text-sm mb-2"><strong>Email:</strong> test.customer@example.com</p>
                  <p className="text-sm mb-4"><strong>Password:</strong> any password will work</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={fillCustomerCredentials}
                  >
                    Fill Customer Credentials
                  </Button>
                </TabsContent>
                <TabsContent value="provider" className="p-4">
                  <p className="text-sm mb-2"><strong>Email:</strong> test.provider@example.com</p>
                  <p className="text-sm mb-4"><strong>Password:</strong> any password will work</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={fillProviderCredentials}
                  >
                    Fill Provider Credentials
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="bg-muted/50 text-xs text-muted-foreground p-3">
              <p className="w-full text-center">
                Note: Any email containing "test" will work with any password.
                Include "provider" in the email to login as a service provider.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
