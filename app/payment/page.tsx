'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import { initiatePayment } from '@/services/payment.service';
import { getPriceByCountry } from '@/lib/price-utils';
import { toast } from 'sonner';
import { CheckCircle, CreditCard, Shield, Lock, Loader2, Users } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const purposeLabels: Record<string, string> = {
  employment: 'Employment Verification',
  loan: 'Loan Application',
  credit_check: 'Personal Credit Check',
  tenant: 'Tenant Verification',
  business: 'Business Purpose',
  other: 'Other',
};

export default function PaymentPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [userCountry, setUserCountry] = useState<string>('');
  const [priceInfo, setPriceInfo] = useState<ReturnType<typeof getPriceByCountry> | null>(null);

  useEffect(() => {
    const fetchUserCountry = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        const country = userData?.country || '';
        setUserCountry(country);
        setPriceInfo(getPriceByCountry(country));
      } catch (error) {
        console.error('Error fetching user country:', error);
        setPriceInfo(getPriceByCountry(''));
      }
    };

    fetchUserCountry();
  }, [user]);

  const handlePayment = async () => {
    if (!user || !priceInfo) return;

    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      const userPurposes = userData?.purposes || [];

      const purposeLabelsArray = userPurposes.map(
        (purposeId: string) => purposeLabels[purposeId] || purposeId
      );

      const response = await initiatePayment(
        user.uid,
        user.email,
        priceInfo.amount,
        priceInfo.currency,
        purposeLabelsArray
      );

      console.log("Response", response)

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        toast.error('Failed to initiate payment');
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader className="text-center px-4 sm:px-6 space-y-3">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                  <CreditCard className="h-12 w-12 sm:h-14 sm:w-14 text-green-600 relative" />
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Complete Your Payment – Unlock Your CRB Report Instantly
              </CardTitle>
              <CardDescription className="text-sm sm:text-base lg:text-lg">
                Secure payment powered by Paystack – Your report will be available immediately after payment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-4 sm:px-6 pb-8">
              <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 sm:p-8 border-2 border-green-200 dark:border-green-800 shadow-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-green-600 hover:bg-green-600 text-white px-4 py-1 text-xs font-semibold shadow-lg">
                    MOST POPULAR
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                  <span className="text-xl font-semibold text-foreground">CRB Report</span>
                  <div className="text-center sm:text-right">
                    <div className="text-5xl sm:text-6xl font-bold text-green-600">
                      {priceInfo ? priceInfo.displayPrice : '...'}
                    </div>
                    <span className="text-sm text-muted-foreground">One-time payment</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-base font-medium text-foreground">Full credit history report</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-base font-medium text-foreground">Current credit score</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-base font-medium text-foreground">Instant digital delivery</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-base font-medium text-foreground">Valid for official use</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-5 text-sm sm:text-base">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-900 dark:text-blue-100 font-medium">
                    You will be securely redirected to Paystack to complete payment. After success, your personalized CRB report will be ready instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="italic">Thousands have already unlocked their reports today</span>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-xl shadow-green-600/30 hover:shadow-green-600/40 transition-all duration-200 hover:scale-[1.02]"
                size="lg"
                disabled={loading || !priceInfo}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </span>
                ) : priceInfo ? (
                  `Pay ${priceInfo.displayPrice} & Get Report Now`
                ) : (
                  'Loading...'
                )}
              </Button>

              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span>Paystack</span>
                    <span className="mx-1">•</span>
                    <span className="text-green-600">100% Secure</span>
                    <span className="mx-1">•</span>
                    <Lock className="h-4 w-4 text-green-600" />
                    <span>Bank-Level Encryption</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-full">
                      <Lock className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-full">
                      <Shield className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">No Card Details Stored</span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-muted-foreground/80">
                  By proceeding, you agree to our{' '}
                  <button className="underline hover:text-foreground transition-colors">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button className="underline hover:text-foreground transition-colors">
                    Privacy Policy
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
