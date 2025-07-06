// src/stores/sessionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './userStore';
import { useCompanyStore } from './companyStore';
import { useClientStore } from './clientStore';
import { useProductStore } from './productStore';
import { useCategoryStore } from './categoryStore';
import { useMessageStore } from './messageStore';

interface SessionState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,

      // Almacena el token al hacer login
      login: (token) => set({ token }),

      // Elimina el token al hacer logout
      logout: () => set({ token: null }),
    }),
    {
      name: 'dante-session-token', // Clave usada en localStorage
    }
  )
);

export const logoutAllStores = () => {
                useUserStore.getState().logout();
                useCompanyStore.getState().logout();
                useClientStore.getState().logout();
                useProductStore.getState().logout();
                useCategoryStore.getState().logout();
                useMessageStore.getState().logout();
                useSessionStore.getState().logout();
};