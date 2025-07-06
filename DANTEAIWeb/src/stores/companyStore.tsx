// src/stores/companyStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompanyModel } from '../models/companyModels';

interface CompanyState {
  company: CompanyModel | null;
  token: string | null;
  login: (company: CompanyModel, token: string) => void;
  logout: () => void;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      company: null,
      token: null,
      login: (company, token) => set({ company, token }),
      logout: () => set({ company: null, token: null }),
    }),
    {
      name: 'dante-session-company',
    }
  )
);