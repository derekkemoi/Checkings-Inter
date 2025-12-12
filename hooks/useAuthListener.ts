'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { subscribeToAuthChanges } from '@/services/auth.service';

export const useAuthListener = () => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);
};
