
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, UserRound } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  accountType: z.enum(['customer', 'provider'], {
    required_error: 'Please select an account type',
  }),
});

type FormData = z.infer<typeof formSchema>;

const SignUp = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      accountType: 'customer',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Pass the validated form data, ensuring all required fields are non-optional
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        accountType: data.accountType,
      });
      
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <div className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-all ${field.value === 'customer' ? 'border-primary bg-primary/5' : 'border-input'}`}>
                              <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${field.value === 'customer' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                  <User className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-medium">Customer</div>
                                  <div className="text-sm text-muted-foreground">Find and book services</div>
                                </div>
                              </div>
                              <RadioGroupItem value="customer" id="customer" className="sr-only" />
                            </div>
                          </FormControl>
                        </FormItem>
                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <div className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-all ${field.value === 'provider' ? 'border-primary bg-primary/5' : 'border-input'}`}>
                              <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${field.value === 'provider' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                  <UserRound className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-medium">Service Provider</div>
                                  <div className="text-sm text-muted-foreground">Offer services to customers</div>
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Account'}
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
