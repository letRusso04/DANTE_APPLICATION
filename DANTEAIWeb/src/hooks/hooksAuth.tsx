// src/hooks/useCompanyAuth.ts
import { useCompanyStore } from '../stores/companyStore';

export function useCompanyAuth() {
  const { company, token, login, logout } = useCompanyStore();

  return {
    company,
    token,
    isAuthenticated: !!company && !!token,
    login,
    logout,
  };
}