// src/stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserModel } from '../models/userModels';


interface UserState {
  user: UserModel | null;
  setUser: (user: UserModel) => void;
  clearUser: () => void;
  logout: () => void;

}

export const useUserStore = create<UserState>()(
  
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      logout: () => set({ user: null }),

    }),
    {
      name: 'dante-session-user',
    }
  )
);
