import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/header';
import LimitedOfferBanner from '@/components/LimitedOfferBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CRB Checker - Get Your Credit Report Instantly',
  description: 'Access your Credit Bureau Report instantly. Trusted for employment, loans, and personal credit checks in Kenya.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <LimitedOfferBanner />
              <div className="flex-1 pt-[88px]">
                {children}
              </div>
            </div>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
