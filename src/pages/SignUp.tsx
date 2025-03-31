
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Building2, User, UserRound, Briefcase, MapPin, Phone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Basic form schema for all users
const baseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  accountType: z.enum(['customer', 'provider'], {
    required_error: 'Please select an account type',
  }),
});

// Extended schema for providers
const providerSchema = baseSchema.extend({
  businessName: z.string().min(2, 'Business name is required').optional().or(z.literal('')),
  serviceType: z.string().min(1, 'Please select at least one service').optional().or(z.literal('')),
  address: z.string().min(5, 'Address is required').optional().or(z.literal('')),
  city: z.string().min(2, 'City is required').optional().or(z.literal('')),
  state: z.string().min(2, 'State is required').optional().or(z.literal('')),
  zipCode: z.string().min(5, 'Valid zip code is required').optional().or(z.literal('')),
  phone: z.string().min(10, 'Valid phone number is required').optional().or(z.literal('')),
});

// Conditional schema based on account type
const formSchema = z.discriminatedUnion('accountType', [
  z.object({ accountType: z.literal('customer'), ...baseSchema.shape }),
  z.object({ accountType: z.literal('provider'), ...providerSchema.shape }),
]);

type FormData = z.infer<typeof formSchema>;

const SignUp = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState<'customer' | 'provider'>('customer');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      accountType: 'customer',
      businessName: '',
      serviceType: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    },
    mode: 'onChange',
  });

  // Watch for account type changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'accountType') {
        setSelectedAccountType(value.accountType as 'customer' | 'provider');
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (data.accountType === 'provider') {
        // Register as service provider with additional fields
        await register({
          name: data.name,
          email: data.email,
          password: data.password,
          accountType: 'provider',
          businessName: data.businessName || '',
          services: [data.serviceType || ''],
          location: {
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
          },
          phone: data.phone || '',
        });
      } else {
        // Register as customer
        await register({
          name: data.name,
          email: data.email,
          password: data.password,
          accountType: 'customer',
        });
      }
      
      toast({
        title: 'Account created',
        description: 'Please verify your email to continue.',
      });
      
      // Navigate to verification page with email
      navigate('/verify-email', { state: { email: data.email } });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: 'There was a problem creating your account.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const serviceOptions = [
    "Oil Change",
    "Tire Service",
    "Brake Repair",
    "Engine Repair",
    "Transmission Service",
    "AC Service",
    "Battery Service",
    "General Maintenance"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container pt-24 pb-16">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground">
              Join our community and start exploring.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.clearErrors();
                        }}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <div className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-all ${field.value === 'customer' ? 'border-primary bg-primary/5 shadow-sm' : 'border-input'}`}>
                              <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full ${field.value === 'customer' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                  <Car className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-medium">Customer</div>
                                  <div className="text-sm text-muted-foreground">Find and book car services</div>
                                </div>
                              </div>
                              <RadioGroupItem value="customer" id="customer" className="sr-only" />
                            </div>
                          </FormControl>
                        </FormItem>
                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <div className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-all ${field.value === 'provider' ? 'border-primary bg-primary/5 shadow-sm' : 'border-input'}`}>
                              <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full ${field.value === 'provider' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                  <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-medium">Service Provider</div>
                                  <div className="text-sm text-muted-foreground">Offer automotive services</div>
                                </div>
                              </div>
                              <RadioGroupItem value="provider" id="provider" className="sr-only" />
                            </div>
                          </FormControl>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Common fields for both account types */}
              <div className={selectedAccountType === 'provider' ? 'bg-secondary/20 p-5 rounded-lg' : ''}>
                {selectedAccountType === 'provider' && (
                  <div className="flex items-center mb-4 gap-2 text-primary">
                    <Briefcase className="h-5 w-5" />
                    <h3 className="font-medium">Business Information</h3>
                  </div>
                )}

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{selectedAccountType === 'provider' ? 'Owner Name' : 'Name'}</FormLabel>
                        <FormControl>
                          <Input placeholder={selectedAccountType === 'provider' ? "Enter business owner's name" : "Enter your name"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Provider-specific fields */}
                  {selectedAccountType === 'provider' && (
                    <>
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your business name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Service</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your primary service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {serviceOptions.map((service) => (
                                  <SelectItem key={service} value={service}>
                                    {service}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              You can add more services after registration
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Provider-specific location fields */}
              {selectedAccountType === 'provider' && (
                <div className="bg-secondary/20 p-5 rounded-lg space-y-4">
                  <div className="flex items-center mb-4 gap-2 text-primary">
                    <MapPin className="h-5 w-5" />
                    <h3 className="font-medium">Business Location</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter state" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter zip code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter business phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating...' : `Create ${selectedAccountType === 'provider' ? 'Business' : 'Customer'} Account`}
              </Button>
            </form>
          </Form>

          <Separator className="my-6" />

          <div className="text-center">
            <p className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
