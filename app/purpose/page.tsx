'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { Header } from '@/components/layout/header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { purposeSchema } from '@/lib/validations';
import { useAuthStore } from '@/store/useAuthStore';
import { db } from '@/lib/firebase';
import type { PurposeFormData } from '@/types';
import { Briefcase, Building, UserCheck, FileText } from 'lucide-react';

const purposes = [
  { id: 'employment', label: 'Employment', icon: Briefcase },
  { id: 'loan', label: 'Loan Application', icon: Building },
  { id: 'credit_check', label: 'Personal Credit Check', icon: UserCheck },
  { id: 'tenant', label: 'Tenant Verification', icon: FileText },
  { id: 'business', label: 'Business Purpose', icon: Building },
  { id: 'other', label: 'Other', icon: FileText },
];

export default function PurposePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<PurposeFormData>({
    resolver: zodResolver(purposeSchema),
    defaultValues: {
      purposes: [],
    },
  });

  const onSubmit = async (data: PurposeFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        purposes: data.purposes,
      });
      toast.success('Purpose saved successfully!');
      router.push('/payment');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save purpose.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-3xl">
            <CardHeader className="text-center px-4 sm:px-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold">What&apos;s the purpose of your CRB check?</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-2">
                Select all that apply. This helps us provide you with the most relevant information.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="purposes"
                    render={() => (
                      <FormItem>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                          {purposes.map((purpose) => {
                            const Icon = purpose.icon;
                            return (
                              <FormField
                                key={purpose.id}
                                control={form.control}
                                name="purposes"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={purpose.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <Card className={`w-full cursor-pointer transition-all hover:shadow-md ${
                                        field.value?.includes(purpose.id) ? 'border-primary bg-primary/5' : ''
                                      }`}>
                                        <CardContent className="p-4">
                                          <FormControl>
                                            <div className="flex items-center gap-3">
                                              <Checkbox
                                                checked={field.value?.includes(purpose.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, purpose.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== purpose.id
                                                        )
                                                      );
                                                }}
                                              />
                                              <Icon className="h-5 w-5 text-primary" />
                                              <FormLabel className="font-normal cursor-pointer">
                                                {purpose.label}
                                              </FormLabel>
                                            </div>
                                          </FormControl>
                                        </CardContent>
                                      </Card>
                                    </FormItem>
                                  );
                                }}
                              />
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Saving...' : 'Continue to Payment'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
