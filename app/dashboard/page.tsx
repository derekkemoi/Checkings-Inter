'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { db } from '@/lib/firebase';
import { formatPrice } from '@/lib/price-utils';
import type { User } from '@/types';
import { FileText, CheckCircle, Clock, User as UserIcon, MapPin, CreditCard, ArrowRight, Shield, Mail, Edit } from 'lucide-react';
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

  const getInitials = () => {
    if (!userData) return 'U';
    return `${userData.firstName.charAt(0)}${userData.secondName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-50 dark:from-green-950/20 to-transparent">
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl">
          <div className="mb-8">
            <Card className="border-2 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 sm:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                    <AvatarFallback className="bg-green-800 text-white text-2xl font-bold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      Welcome back, {userData?.firstName}!
                    </h1>
                    <p className="text-green-50">
                      Manage your CRB reports and account information
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push('/profile')}
                    className="bg-white hover:bg-green-50 text-green-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Payment Status</CardTitle>
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  {userData?.paymentMade ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <Badge className="bg-green-600 text-white">Paid</Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="h-6 w-6 text-orange-500" />
                      <Badge variant="outline" className="border-orange-500 text-orange-600">Pending</Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {userData?.paymentMade
                    ? 'Payment confirmed successfully'
                    : 'Complete payment to access report'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Report Status</CardTitle>
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  {userData?.paymentMade ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <Badge className="bg-green-600 text-white">Ready</Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="h-6 w-6 text-muted-foreground" />
                      <Badge variant="outline">Not Available</Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {userData?.paymentMade
                    ? 'Your CRB report is ready to view'
                    : 'Report available after payment'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Account Security</CardTitle>
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <Badge className="bg-green-600 text-white">Verified</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your account is secure and verified
                </p>
              </CardContent>
            </Card>
          </div>

          {userData?.paymentMade ? (
            <Card className="border-2 shadow-xl mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 px-6 sm:px-8 py-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-7 w-7 text-green-600" />
                      <Badge className="bg-green-600 text-white text-sm px-3 py-1">Report Ready</Badge>
                    </div>
                    <h2 className="text-3xl font-bold mb-3">Your CRB Report is Ready!</h2>
                    <p className="text-muted-foreground text-lg mb-6">
                      View your complete credit bureau report with detailed credit history, score analysis, and personalized recommendations.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2 mb-6">
                      <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border">
                        <FileText className="h-6 w-6 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Complete Credit History</p>
                          <p className="text-sm text-muted-foreground">
                            All your accounts and payment records
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border">
                        <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Credit Score Analysis</p>
                          <p className="text-sm text-muted-foreground">
                            Your current credit rating and insights
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 h-12 text-base font-semibold w-full sm:w-auto">
                      <Link href="/report">
                        View Full Report
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="border-2 shadow-xl mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-900 px-6 sm:px-8 py-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-7 w-7 text-orange-600" />
                      <Badge variant="outline" className="border-orange-500 text-orange-600 text-sm px-3 py-1">Payment Required</Badge>
                    </div>
                    <h2 className="text-3xl font-bold mb-3">Complete Your Payment</h2>
                    <p className="text-muted-foreground text-lg mb-6">
                      Your CRB report will be available immediately after successful payment. Get instant access to your complete credit history.
                    </p>

                    <div className="bg-white dark:bg-gray-900 border-2 border-orange-200 rounded-lg p-5 mb-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Payment Amount</p>
                          <p className="text-3xl font-bold text-green-600">
                            {userData?.country ? formatPrice(userData.country) : '...'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Processing Time</p>
                          <p className="text-xl font-bold">Instant</p>
                        </div>
                      </div>
                    </div>

                    <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 h-12 text-base font-semibold w-full sm:w-auto">
                      <Link href="/payment">
                        Complete Payment Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Your Information</CardTitle>
              <CardDescription className="text-base">Personal details associated with your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <UserIcon className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Full Name</p>
                    <p className="font-semibold">
                      {userData?.firstName} {userData?.secondName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Email Address</p>
                    <p className="font-semibold">{userData?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">ID Number</p>
                    <p className="font-semibold">{userData?.idNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Country</p>
                    <p className="font-semibold">{userData?.country}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none">
                  <Link href="/profile">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
