'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { Header } from '@/components/layout/header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { profileSchema } from '@/lib/validations';
import { useAuthStore } from '@/store/useAuthStore';
import { db } from '@/lib/firebase';
import { User } from 'lucide-react';

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

interface ProfileFormData {
  firstName: string;
  secondName: string;
  idNumber: string;
  country: string;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      secondName: '',
      idNumber: '',
      country: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        secondName: user.secondName,
        idNumber: user.idNumber,
        country: user.country,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        firstName: data.firstName,
        secondName: data.secondName,
        idNumber: data.idNumber,
        country: data.country,
      });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-3xl">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl">Edit Profile</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Update your personal information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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
                          <Select onValueChange={field.onChange} value={field.value}>
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

                    <div className="pt-4">
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm font-medium mb-1">Email Address</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Email cannot be changed for security reasons
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
