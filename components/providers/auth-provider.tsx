'use client';

import { useEffect } from 'react';
import { useAuthListener } from '@/hooks/useAuthListener';
import { initializeExchangeRates } from '@/services/currency.service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthListener();

  useEffect(() => {
    initializeExchangeRates();
  }, []);

  return <>{children}</>;
}
