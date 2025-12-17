'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { purposeSchema } from '@/lib/validations';
import { useAuthStore } from '@/store/useAuthStore';
import { db } from '@/lib/firebase';
import type { PurposeFormData } from '@/types';
import { Briefcase, Building, ShieldCheck, Home, Landmark, MoreHorizontal, CheckCircle2, Loader2 } from 'lucide-react';

const purposes = [
  { id: 'employment', label: 'Employment', icon: Briefcase },
  { id: 'loan', label: 'Loan Application', icon: Landmark },
  { id: 'credit_check', label: 'Personal Credit Check', icon: ShieldCheck },
  { id: 'tenant', label: 'Tenant Verification', icon: Home },
  { id: 'business', label: 'Business Purpose', icon: Building },
  { id: 'other', label: 'Other', icon: MoreHorizontal },
];

const loadingSteps = [
  'Connecting to credit databases...',
  'Retrieving your payment history...',
  'Analyzing accounts and inquiries...',
  'Calculating your credit score...',
  'Finalizing your report...',
];

export default function PurposePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showGeneratingDialog, setShowGeneratingDialog] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const form = useForm<PurposeFormData>({
    resolver: zodResolver(purposeSchema),
    defaultValues: {
      purposes: [],
    },
  });

  const selectedPurposes = form.watch('purposes') || [];

  useEffect(() => {
    if (showGeneratingDialog && !isComplete) {
      const totalDuration = 6000;
      const progressInterval = 50;
      const stepDuration = totalDuration / loadingSteps.length;
      let elapsed = 0;

      const interval = setInterval(() => {
        elapsed += progressInterval;
        const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
        setProgress(newProgress);

        const newStep = Math.min(
          Math.floor(elapsed / stepDuration),
          loadingSteps.length - 1
        );
        setCurrentStep(newStep);

        if (elapsed >= totalDuration) {
          clearInterval(interval);
          setIsComplete(true);
          setTimeout(() => {
            router.push('/payment');
          }, 1000);
        }
      }, progressInterval);

      return () => clearInterval(interval);
    }
  }, [showGeneratingDialog, isComplete, router]);

  const onSubmit = async (data: PurposeFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        purposes: data.purposes,
      });
      setShowGeneratingDialog(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save purpose.');
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-3xl shadow-lg">
            <CardHeader className="text-center px-4 sm:px-6 space-y-3">
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                What Do You Need Your CRB Report For?
              </CardTitle>
              <CardDescription className="text-sm sm:text-base lg:text-lg">
                Select all that apply. This helps us generate the most accurate and relevant report for your goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="purposes"
                    render={() => (
                      <FormItem>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                          {purposes.map((purpose) => {
                            const Icon = purpose.icon;
                            return (
                              <FormField
                                key={purpose.id}
                                control={form.control}
                                name="purposes"
                                render={({ field }) => {
                                  const isSelected = field.value?.includes(purpose.id);
                                  return (
                                    <FormItem key={purpose.id}>
                                      <FormControl>
                                        <Card
                                          className={`relative cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                                            isSelected
                                              ? 'border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md'
                                              : 'hover:border-green-200'
                                          }`}
                                          onClick={() => {
                                            const newValue = isSelected
                                              ? field.value?.filter((value) => value !== purpose.id)
                                              : [...field.value, purpose.id];
                                            field.onChange(newValue);
                                          }}
                                        >
                                          <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                                            <div className="relative">
                                              <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${
                                                isSelected ? 'text-green-600' : 'text-muted-foreground'
                                              }`} />
                                              {isSelected && (
                                                <div className="absolute -top-1 -right-1 bg-green-600 rounded-full p-0.5">
                                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                                </div>
                                              )}
                                            </div>
                                            <span className={`text-sm sm:text-base font-medium ${
                                              isSelected ? 'text-green-700 dark:text-green-400' : 'text-foreground'
                                            }`}>
                                              {purpose.label}
                                            </span>
                                          </CardContent>
                                        </Card>
                                      </FormControl>
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

                  {selectedPurposes.length > 0 && (
                    <div className="text-center">
                      <p className="text-green-600 dark:text-green-500 font-semibold text-sm sm:text-base">
                        You selected {selectedPurposes.length} {selectedPurposes.length === 1 ? 'purpose' : 'purposes'}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transition-all duration-200 hover:scale-[1.02]"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      'Generate Your Report Now'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>

        <Dialog open={showGeneratingDialog} onOpenChange={setShowGeneratingDialog} modal>
          <DialogContent className="sm:max-w-md md:max-w-lg" hideCloseButton onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
            <div className="space-y-6 py-6">
              {!isComplete ? (
                <>
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                        <Loader2 className="h-16 w-16 text-green-600 animate-spin relative" strokeWidth={2} />
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      Generating Your Personalized CRB Report...
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                      We&apos;re securely analyzing your credit history across all major bureaus. This ensures maximum accuracy tailored to your selected purposes.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Progress</span>
                        <span className="font-bold text-green-600">{Math.round(progress)}% complete</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    <div className="space-y-2 min-h-[120px]">
                      {loadingSteps.map((step, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 transition-all duration-300 ${
                            index <= currentStep ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          {index < currentStep ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : index === currentStep ? (
                            <Loader2 className="h-5 w-5 text-green-600 animate-spin mt-0.5 flex-shrink-0" />
                          ) : (
                            <div className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${
                            index <= currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                          }`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4 py-8">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                      <CheckCircle2 className="h-20 w-20 text-green-600 relative" strokeWidth={2} />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-green-600">
                    Report Successfully Generated!
                  </h2>
                  <p className="text-base text-muted-foreground">
                    Your comprehensive CRB report is ready
                  </p>
                  <div className="pt-2">
                    <Loader2 className="h-6 w-6 text-green-600 animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Redirecting to payment...</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
