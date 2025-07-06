import axios from 'axios';
import type { ClientModel } from '../models/clientModels';
import { API_URL } from './routes/routesAPI';

export const clientServices = {
  async getClients(companyId: string): Promise<ClientModel[]> {
    const response = await axios.get(`${API_URL}/clients`, {
      params: { company_id: companyId },
    });
    return response.data;
  },

  async getClient(id: string): Promise<ClientModel> {
    const response = await axios.get(`${API_URL}/clients/${id}`);
    return response.data;
  },

  async createClient(data: Partial<ClientModel>, avatarFile?: File): Promise<ClientModel> {
    const formData = new FormData();
    formData.append('company_id', data.company_id || '');
    formData.append('name', data.name || '');
    formData.append('email', data.email || '');
    if (data.category_id) formData.append('category_id', data.category_id);
    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);
    if (data.document_type) formData.append('document_type', data.document_type);
    if (data.document_number) formData.append('document_number', data.document_number);
    if (avatarFile) formData.append('avatar', avatarFile);

    const response = await axios.post(`${API_URL}/clients`, formData);
    return response.data;
  },

  async updateClient(id: string, data: Partial<ClientModel>, avatarFile?: File): Promise<ClientModel> {
    const formData = new FormData();

    // Agrega todos los campos como en createClient
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);
    if (data.document_type) formData.append('document_type', data.document_type);
    if (data.document_number) formData.append('document_number', data.document_number);
    if (data.category_id) formData.append('category_id', data.category_id);
    if (data.company_id) formData.append('company_id', data.company_id);
    if (avatarFile) formData.append('avatar', avatarFile);

    const response = await axios.put(`${API_URL}/clients/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async deleteClient(id: string): Promise<void> {
    await axios.delete(`${API_URL}/clients/${id}`);
  }
  
};
