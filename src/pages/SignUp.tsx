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
import { RegisterData, ProviderRegisterData } from '@/services/auth-service';

const customerSchema = z.object({
  accountType: z.literal('customer'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const providerSchema = z.object({
  accountType: z.literal('provider'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  businessName: z.string().min(2, 'Business name is required'),
  serviceType: z.string().min(1, 'Please select at least one service'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid zip code is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

const formSchema = z.discriminatedUnion('accountType', [
  customerSchema,
  providerSchema
]);

type CustomerFormData = z.infer<typeof customerSchema>;
type ProviderFormData = z.infer<typeof providerSchema>;
type FormData = z.infer<typeof formSchema>;

const SignUp = () => {
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState<'customer' | 'provider'>('customer');
  const [showAccountSelection, setShowAccountSelection] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: 'customer',
      name: '',
      email: '',
      password: '',
    } as FormData,
    mode: 'onChange',
  });

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'accountType') {
        setSelectedAccountType(value.accountType as 'customer' | 'provider');
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const handleAccountTypeSelection = (type: 'customer' | 'provider') => {
    form.setValue('accountType', type);
    setSelectedAccountType(type);
    setShowAccountSelection(false);
    setShowForm(true);
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted with data:", { ...data, password: "REDACTED" });
    setIsLoading(true);
    try {
      if (data.accountType === 'provider') {
        const providerData = data as ProviderFormData;
        
        console.log("Registering provider with data:", { ...providerData, password: "REDACTED" });
        
        const registerData: ProviderRegisterData = {
          email: providerData.email,
          password: providerData.password,
          name: providerData.name,
          accountType: 'provider',
          businessName: providerData.businessName,
          services: [providerData.serviceType],
          location: {
            address: providerData.address,
            city: providerData.city,
            state: providerData.state,
            zipCode: providerData.zipCode,
          },
          phone: providerData.phone
        };
        
        console.log("Formatted provider register data:", { ...registerData, password: "REDACTED" });
        
        try {
          await registerUser(registerData);
          console.log("Provider registration successful");
          
          toast({
            title: 'Provider account created',
            description: 'Please verify your email to continue.',
          });
          
          navigate('/verify-email', { state: { email: data.email } });
        } catch (error) {
          console.error("Provider registration failed:", error);
          throw error;
        }
      } else {
        const customerData = data as CustomerFormData;
        
        console.log("Registering customer with data:", { ...customerData, password: "REDACTED" });
        
        const registerData: RegisterData = {
          name: customerData.name,
          email: customerData.email,
          password: customerData.password,
          accountType: 'customer',
        };
        
        try {
          await registerUser(registerData);
          console.log("Customer registration successful");
          
          toast({
            title: 'Account created',
            description: 'Please verify your email to continue.',
          });
          
          navigate('/verify-email', { state: { email: data.email } });
        } catch (error) {
          console.error("Customer registration failed:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'There was a problem creating your account.',
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

  const handleBackToSelection = () => {
    setShowAccountSelection(true);
    setShowForm(false);
  };

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

          {showAccountSelection ? (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold">Choose Account Type</h2>
                <p className="text-muted-foreground">Select the type of account you want to create</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Button 
                  onClick={() => handleAccountTypeSelection('customer')}
                  variant="customer"
                  className="h-auto py-8 flex flex-col items-center gap-4 border-2 border-blue-200 hover:border-blue-500"
                >
                  <div className="p-4 rounded-full bg-blue-100">
                    <UserRound className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">Customer</h3>
                    <p className="text-sm text-white/80">Find and book car services</p>
                  </div>
                </Button>

                <Button 
                  onClick={() => handleAccountTypeSelection('provider')}
                  variant="provider"
                  className="h-auto py-8 flex flex-col items-center gap-4 border-2 border-amber-200 hover:border-amber-500"
                >
                  <div className="p-4 rounded-full bg-amber-100">
                    <Briefcase className="h-8 w-8 text-amber-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">Service Provider</h3>
                    <p className="text-sm text-white/80">Offer automotive services</p>
                  </div>
                </Button>
              </div>
            </div>
          ) : null}

          {showForm && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToSelection}
                  className="mb-4"
                >
                  ← Back to selection
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-full ${selectedAccountType === 'customer' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                  {selectedAccountType === 'customer' ? (
                    <Car className="h-5 w-5" />
                  ) : (
                    <Building2 className="h-5 w-5" />
                  )}
                </div>
                <h2 className="text-xl font-semibold">
                  {selectedAccountType === 'customer' ? 'Customer' : 'Service Provider'} Registration
                </h2>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <input type="hidden" {...field} />
                    )}
                  />

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
            </div>
          )}

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
