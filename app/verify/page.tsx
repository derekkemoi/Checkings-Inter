'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { verifyPayment } from '@/services/payment.service';
import { useAuthStore } from '@/store/useAuthStore';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    const reference = searchParams.get('reference');

    if (!reference || !user) {
      if (!reference) {
        setStatus('failed');
      }
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyPayment(reference, user.uid);

        if (response.success) {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        setStatus('failed');
      }
    };

    verify();
  }, [searchParams, user]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center px-4 sm:px-6">
              {status === 'loading' && (
                <>
                  <div className="flex justify-center mb-4">
                    <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-primary animate-spin" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">Verifying Payment...</CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-2">
                    Please wait while we verify your payment
                  </CardDescription>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl text-green-600">Payment Successful!</CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-2">
                    Your CRB report is now being generated
                  </CardDescription>
                </>
              )}

              {status === 'failed' && (
                <>
                  <div className="flex justify-center mb-4">
                    <XCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl text-red-600">Payment Failed</CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-2">
                    There was an issue processing your payment
                  </CardDescription>
                </>
              )}
            </CardHeader>

            {status === 'success' && (
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-900 dark:text-green-100">
                  Your report will be available in your dashboard within a few minutes.
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </CardContent>
            )}

            {status === 'failed' && (
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-900 dark:text-red-100">
                  Please try again or contact support if the issue persists.
                </div>

                <Button asChild className="w-full" size="lg" variant="outline">
                  <Link href="/payment">Try Again</Link>
                </Button>
              </CardContent>
            )}
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
