// src/services/userService.ts
import axios from 'axios';
import type { UserModel } from '../models/userModels';
import { useUserStore } from '../stores/userStore';
import { useSessionStore } from '../stores/sessionStore';
import { useCompanyStore } from '../stores/companyStore';

const API_URL = 'http://127.0.0.1:5000/api/users';

export async function loginUser(email: string, password: string) {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });

    const token = res.data.access_token;
    const user = res.data.user;

    // Guardar en stores
    useSessionStore.getState().login(token);
    useUserStore.getState().setUser(user);

    return { success: true, token, user };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || 'Error al iniciar sesión',
    };
  }
}

export async function createUser(data: FormData | Record<string, any>) {
  try {
    const isFormData = data instanceof FormData;
    const res = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    });
    return { success: true, user: res.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.message || 'Error al crear usuario' };
  }
}

export async function getUsers() {
  try {
    const companyId = useCompanyStore.getState().company?.id_company;
    if (!companyId) {
      return { success: false, error: 'Empresa no autenticada' };
    }

    const res = await axios.get(API_URL, {
      params: { company_id: companyId },
    });

    return { success: true, users: res.data as UserModel[] };
  } catch (err) {
    return { success: false, error: 'Error al obtener usuarios' };
  }
}
export async function getCurrentUser() {
  try {
    const user = useUserStore.getState().user;
    if (!user) return { success: false, error: 'Usuario no autenticado' };
    return { success: true, user };
  } catch (err) {
    return { success: false, error: 'Error al obtener datos del usuario' };
  }
}

export async function updateOtherUser(id: string, data: Partial<UserModel> | FormData, isFormData = false) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? data as FormData : JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error al actualizar');

    const user = await response.json();
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
export async function updateCurrentUser(data: Partial<UserModel>) {
  try {
    const user = useUserStore.getState().user;
    if (!user) return { success: false, error: 'Usuario no autenticado' };

    const res = await updateUser(user.id_user, data);

    if (res.success && res.user) {
      useUserStore.getState().setUser(res.user);
    }

    return res;
  } catch (err) {
    return { success: false, error: 'Error al actualizar perfil' };
  }
}
export async function getUserById(id: string) {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return { success: true, user: res.data };
  } catch (err) {
    return { success: false, error: 'Usuario no encontrado' };
  }
}

export async function updateUser(id: string, data: Partial<UserModel>) {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return { success: true, user: res.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.message || 'Error al actualizar' };
  }
}

export async function deleteUser(id: string) {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Error al eliminar' };
  }
}

export async function updateUserAvatar(id: string, avatarFile: File) {
  const formData = new FormData();
  formData.append('avatar', avatarFile);

  try {
    const res = await axios.put(`${API_URL}/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, user: res.data };
  } catch (err) {
    return { success: false, error: 'Error al actualizar avatar' };
  }
}


export async function changeUserPassword(id: string, current_password: string, new_password: string) {
  try {
    const res = await axios.put(`${API_URL}/${id}/change-password`, {
      current_password,
      new_password,
    });
    return { success: true, message: res.data.message };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || 'Error al cambiar contraseña',
    };
  }
}
