'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { Header } from '@/components/layout/header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/useAuthStore';
import { db } from '@/lib/firebase';
import { fetchCRBReport } from '@/services/report.service';
import type { User, CRBReport } from '@/types';
import { FileText, TrendingUp, AlertCircle, Download, Building2, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: authUser } = useAuthStore();
  const [userData, setUserData] = useState<User | null>(null);
  const [report, setReport] = useState<CRBReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!authUser) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', authUser.uid),
      async (doc) => {
        if (doc.exists()) {
          const data = doc.data() as User;
          setUserData(data);

          if (!data.paymentMade) {
            router.push('/dashboard');
            return;
          }

          if (data.crbReportId) {
            try {
              const reportData = await fetchCRBReport(data.crbReportId);
              setReport(reportData);
            } catch (error) {
              toast({
                title: 'Error',
                description: 'Failed to load report. Please try again.',
                variant: 'destructive',
              });
            }
          }
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authUser, router, toast]);

  const handleDownloadPDF = async () => {
    if (!report) return;

    setDownloading(true);
    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      const element = document.getElementById('report-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`CRB-Report-${report.reportId}.pdf`);

      toast({
        title: 'Success',
        description: 'Report downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <Skeleton className="h-12 w-64 mb-8" />
            <Skeleton className="h-96" />
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!userData?.paymentMade || !report) {
    return null;
  }

  const getScoreColor = (color: string) => {
    const colors = {
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
    };
    return colors[color as keyof typeof colors] || 'text-gray-600';
  };

  const getScoreBgColor = (color: string) => {
    const colors = {
      green: 'bg-green-100 dark:bg-green-950',
      yellow: 'bg-yellow-100 dark:bg-yellow-950',
      orange: 'bg-orange-100 dark:bg-orange-950',
      red: 'bg-red-100 dark:bg-red-950',
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-950';
  };

  const getScoreBadgeVariant = (color: string) => {
    if (color === 'green') return 'default';
    return 'secondary';
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Header />

        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Credit Bureau Report
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Generated on {new Date(report.generatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <Button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </div>

          <div id="report-content" className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 space-y-8">
            <div className="border-b pb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Official Credit Report</h2>
                    <p className="text-sm text-muted-foreground">{report.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Report ID</p>
                  <p className="text-sm font-mono">{report.reportId.slice(0, 8)}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              <Card className={`${getScoreBgColor(report.scoreColor)} border-2 shadow-lg`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Credit Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-6xl font-bold ${getScoreColor(report.scoreColor)} mb-3`}>
                    {report.score}
                  </div>
                  <Badge variant={getScoreBadgeVariant(report.scoreColor)} className="mb-3">
                    {report.scoreCategory}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {report.summary}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</p>
                    <p className="font-semibold text-lg">{report.personalInfo.fullName}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">ID Number</p>
                    <p className="font-semibold">{report.personalInfo.idNumber}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Address</p>
                    <p className="font-semibold">{report.personalInfo.address}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Credit Bureau
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Reporting Agency</p>
                    <p className="font-semibold text-sm">{report.creditBureau}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Valid Until</p>
                    <p className="font-semibold">
                      {new Date(report.expiresAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Currency</p>
                    <p className="font-semibold">{report.currency}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Reporting Banks & Financial Institutions
                </CardTitle>
                <CardDescription>
                  Institutions that contributed to this credit report
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.banks.map((bank, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border"
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <p className="font-semibold">{bank}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-blue-200 dark:border-blue-900">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Credit Improvement Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized advice to improve your credit score
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {report.advice.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900"
                    >
                      <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg p-6 border-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                    {report.disclaimer}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    This credit report is generated from data provided by licensed Credit Reference
                    Bureaus. The information is accurate as of the generation date. For any disputes
                    or corrections, please contact the respective financial institution or credit
                    bureau directly.
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Payment Reference: <span className="font-mono">{report.paymentReference}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
