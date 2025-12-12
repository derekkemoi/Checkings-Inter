import { create } from 'zustand';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { AuthState, User } from '@/types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));
