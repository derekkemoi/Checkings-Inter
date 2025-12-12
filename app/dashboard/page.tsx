'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { Header } from '@/components/layout/header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/useAuthStore';
import { db } from '@/lib/firebase';
import { BASE_PRICE_USD } from '@/lib/constants';
import type { User } from '@/types';
import { FileText, CheckCircle, Clock, User as UserIcon, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', authUser.uid),
      (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as User);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authUser]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="space-y-6">
              <Skeleton className="h-12 w-64" />
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </div>
              <Skeleton className="h-64" />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Welcome back, {userData?.firstName}!
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your CRB reports and account information
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {userData?.paymentMade ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <Badge variant="default">Paid</Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <Badge variant="secondary">Pending</Badge>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {userData?.paymentMade
                    ? 'Your payment has been confirmed'
                    : 'Complete payment to access your report'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Report Status</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {userData?.paymentMade ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <Badge variant="default">Ready</Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <Badge variant="outline">Not Available</Badge>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {userData?.paymentMade
                    ? 'Your CRB report is ready to view'
                    : 'Report will be available after payment'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Info</CardTitle>
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userData?.firstName} {userData?.secondName}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ID: {userData?.idNumber}
                </p>
              </CardContent>
            </Card>
          </div>

          {userData?.paymentMade ? (
            <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <Badge variant="default">Report Ready</Badge>
                </div>
                <CardTitle className="text-2xl">Your CRB Report is Ready!</CardTitle>
                <CardDescription>
                  View your complete credit bureau report with detailed credit history and score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Complete Credit History</p>
                        <p className="text-xs text-muted-foreground">
                          All your accounts and payment records
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Credit Score</p>
                        <p className="text-xs text-muted-foreground">
                          Your current credit rating
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/report">
                      View Full Report
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-6 w-6 text-yellow-500" />
                  <Badge variant="secondary">Payment Required</Badge>
                </div>
                <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
                <CardDescription>
                  Your CRB report will be available immediately after successful payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm text-yellow-900 dark:text-yellow-100">
                    To access your credit bureau report, please complete the payment of ${BASE_PRICE_USD}
                  </div>

                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/payment">
                      Complete Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>Personal details associated with your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">
                        {userData?.firstName} {userData?.secondName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">ID Number</p>
                      <p className="text-sm text-muted-foreground">{userData?.idNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Country</p>
                      <p className="text-sm text-muted-foreground">{userData?.country}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{userData?.email}</p>
                    </div>
                  </div>
                </div>

                <Button asChild variant="outline" className="mt-6">
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
