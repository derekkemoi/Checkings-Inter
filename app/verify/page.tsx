import { Suspense } from 'react';
import VerifyPageClient from '../verify/VerifyPageClient';

function VerifyPageFallback() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
          Verifying payment...
        </div>
      </main>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyPageFallback />}>
      <VerifyPageClient />
    </Suspense>
  );
}