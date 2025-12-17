'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { profileSchema } from '@/lib/validations';
import { useAuthStore } from '@/store/useAuthStore';
import { db } from '@/lib/firebase';
import { User, Mail, CreditCard, FileText, CheckCircle, Clock, Edit } from 'lucide-react';

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
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName.charAt(0)}${user.secondName.charAt(0)}`.toUpperCase();
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-4xl">
          <div className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 border-4 border-green-200">
                    <AvatarFallback className="bg-green-600 text-white text-3xl font-bold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-3xl font-bold">
                  {user?.firstName} {user?.secondName}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Manage your account settings and view your CRB status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="font-semibold">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <User className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ID Number</p>
                      <p className="font-semibold">{user?.idNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Country</p>
                      <p className="font-semibold">{user?.country}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                      {user?.paymentMade ? (
                        <Badge className="bg-green-600 text-white mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-orange-500 text-orange-600 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  {user?.paymentMade ? (
                    <Button
                      size="lg"
                      className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-base font-semibold"
                      onClick={() => router.push('/report')}
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      View CRB Report
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-base font-semibold"
                      onClick={() => router.push('/payment')}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Complete Payment
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 h-12 text-base font-semibold"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-5 w-5 mr-2" />
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Edit Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" className="h-11" {...field} />
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
                              <FormLabel className="text-base font-semibold">Second Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" className="h-11" {...field} />
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
                            <FormLabel className="text-base font-semibold">ID/Passport Number</FormLabel>
                            <FormControl>
                              <Input placeholder="12345678" className="h-11" {...field} />
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
                            <FormLabel className="text-base font-semibold">Country</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
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

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 h-11"
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
