'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { initiatePayment } from '@/services/payment.service';
import { BASE_PRICE_USD } from '@/lib/constants';
import { toast } from 'sonner';
import { CheckCircle, CreditCard } from 'lucide-react';
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

  const handlePayment = async () => {
    if (!user) return;

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
        BASE_PRICE_USD,
        'USD',
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
        <Header />

        <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center px-4 sm:px-6">
              <div className="flex justify-center mb-4">
                <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold">Complete Your Payment</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-2">
                Secure payment powered by Paystack
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-4 sm:px-6">
              <div className="bg-muted rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">CRB Report</span>
                  <span className="text-2xl font-bold">
                    ${BASE_PRICE_USD}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Full credit history report</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Current credit score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Instant digital delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Valid for official use</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
                <p className="text-blue-900 dark:text-blue-100">
                  You will be redirected to Paystack to complete your payment securely.
                  After successful payment, your report will be available immediately.
                </p>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay $${BASE_PRICE_USD}`}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
