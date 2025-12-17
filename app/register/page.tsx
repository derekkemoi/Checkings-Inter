'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerSchema } from '@/lib/validations';
import { registerUser } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { db } from '@/lib/firebase';
import type { RegisterFormData } from '@/types';
import { Shield, Eye, EyeOff, Lock, CheckCircle2, Loader2 } from 'lucide-react';

const countries = [
  'United States',
  'United Kingdom',
  'Kenya',
  'Nigeria',
  'Canada',
  'Germany',
  'Australia',
  'Singapore',
  'South Korea',
  'India',
  'Brazil',
  'South Africa',
  'United Arab Emirates (UAE)',
  'Mexico',
];

const getPasswordStrength = (password: string): { strength: 'weak' | 'medium' | 'strong'; color: string; width: string } => {
  if (!password) return { strength: 'weak', color: 'bg-gray-300', width: '0%' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { strength: 'weak', color: 'bg-red-500', width: '33%' };
  if (score <= 3) return { strength: 'medium', color: 'bg-yellow-500', width: '66%' };
  return { strength: 'strong', color: 'bg-green-500', width: '100%' };
};

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ strength: 'weak' | 'medium' | 'strong'; color: string; width: string }>({
    strength: 'weak',
    color: 'bg-gray-300',
    width: '0%'
  });

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userPurposes = userData?.purposes || [];

            if (userPurposes.length > 0) {
              router.push('/dashboard');
            } else {
              router.push('/purpose');
            }
          }
        } catch (error) {
          console.error('Error checking user status:', error);
        }
      }
    };

    checkUserStatus();
  }, [user, router]);

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
      toast.success('Account created! Redirecting...', {
        description: 'Welcome to CRB Status Checker',
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      });
      setTimeout(() => {
        router.push('/purpose');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Email already in use', {
        description: 'Please try logging in or use a different email',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="space-y-3 text-center px-4 sm:px-6 pb-6">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                <Shield className="h-14 w-14 sm:h-16 sm:w-16 text-green-600 dark:text-green-500 relative" strokeWidth={1.5} />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Create Your Account – Get Instant CRB Access
            </CardTitle>
            <CardDescription className="text-sm sm:text-base lg:text-lg">
              Secure registration takes less than 60 seconds – trusted by thousands
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            className="h-11 sm:h-12 text-base focus-visible:ring-green-500 focus-visible:border-green-500"
                            {...field}
                          />
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
                        <FormLabel className="text-sm font-semibold">Second Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="h-11 sm:h-12 text-base focus-visible:ring-green-500 focus-visible:border-green-500"
                            {...field}
                          />
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
                      <FormLabel className="text-sm font-semibold">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          className="h-11 sm:h-12 text-base focus-visible:ring-green-500 focus-visible:border-green-500"
                          {...field}
                        />
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
                      <FormLabel className="text-sm font-semibold">ID/Passport Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="12345678"
                          className="h-11 sm:h-12 text-base focus-visible:ring-green-500 focus-visible:border-green-500"
                          {...field}
                        />
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
                      <FormLabel className="text-sm font-semibold">Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 sm:h-12 text-base focus:ring-green-500 focus:border-green-500">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
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

                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-11 sm:h-12 text-base pr-10 focus-visible:ring-green-500 focus-visible:border-green-500"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setPasswordStrength(getPasswordStrength(e.target.value));
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        {field.value && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                  style={{ width: passwordStrength.width }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium capitalize text-muted-foreground">
                                {passwordStrength.strength}
                              </span>
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-11 sm:h-12 text-base pr-10 focus-visible:ring-green-500 focus-visible:border-green-500"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transition-all duration-200 hover:scale-[1.02]"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-2 text-muted-foreground">Secured by</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Shield className="h-3.5 w-3.5 text-green-600" />
                      <span>Firebase Protected</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Lock className="h-3.5 w-3.5 text-green-600" />
                      <span>Bank-Level Encryption</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      <span>Secure Payments</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-center text-sm sm:text-base text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
