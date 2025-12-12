'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerSchema } from '@/lib/validations';
import { registerUser } from '@/services/auth.service';
import type { RegisterFormData } from '@/types';
import { Shield } from 'lucide-react';

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'Australia',
  'Singapore',
  'South Korea',
  'India',
  'Brazil',
  'South Africa',
  'Kenya',
  'United Arab Emirates (UAE)',
  'Mexico',
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      secondName: '',
      email: '',
      password: '',
      confirmPassword: '',
      idNumber: '',
      country: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created successfully!');
      router.push('/purpose');
    } catch (error: any) {
      toast.error( 
        //error.message 
                  //|| 
        'Email Already In Use With Another Account. Login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-2 text-center px-4 sm:px-6">
            <div className="flex justify-center mb-4">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">Create Your Account</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter your details to get started with your CRB report
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Second Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID/Passport Number</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
