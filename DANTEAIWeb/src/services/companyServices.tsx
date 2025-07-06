// src/services/companyService.ts
import axios from 'axios';
import type { CompanyModel } from '../models/companyModels';
import { useCompanyStore } from '../stores/companyStore';

const API_URL = 'http://127.0.0.1:5000/api/companies';

/**
 * Crear empresa
 */
export async function createCompany(data: CompanyModel) {
  try {
    const res = await axios.post(API_URL, data);
    return { success: true, data: res.data };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || 'Error desconocido',
    };
  }
}

/**
 * Login de empresa y guardar en Zustand
 */
export async function loginCompany(email: string, password: string) {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    if (res.status === 200) {
      const token = res.data.access_token;
      const company = res.data.company;
      useCompanyStore.getState().login(company, token);
      return { success: true, token, company };
    }

    return { success: false, error: 'Credenciales inválidas' };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || 'Credenciales inválidas',
    };
  }
}

/**
 * Obtener todas las empresas (público)
 */
export async function getAllCompanies() {
  try {
    const res = await axios.get(API_URL);
    return { success: true, companies: res.data };
  } catch (err: any) {
    return { success: false, error: 'No se pudieron obtener las empresas' };
  }
}
