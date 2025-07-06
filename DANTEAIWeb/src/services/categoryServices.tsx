import axios from "axios";
import type { CategoryModel } from "../models/categoryModels";
import { API_URL } from "./routes/routesAPI";

const API = `${API_URL}/categories`;

export async function createCategory(data: FormData | Record<string, any>) {
  try {
    const isFormData = data instanceof FormData;
    if (data instanceof FormData) {
    for (const [key, value] of data.entries()) {
        console.log(`${key}:`, value);
    }
    }
    const res = await axios.post<CategoryModel>(API, data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
    return { success: true, category: res.data };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || "Error al crear categoría",
    };
  }
}


export async function updateCategory(id: string, data: FormData | Record<string, any>) {
  try {
    const isFormData = data instanceof FormData;
    const res = await axios.put<CategoryModel>(`${API}/${id}`, data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
    return { success: true, category: res.data };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || "Error al actualizar categoría",
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    await axios.delete(`${API}/${id}`);
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || "Error al eliminar categoría",
    };
  }
}
export async function fetchCategoriesByCompany(companyId: string, typeon: string): Promise<CategoryModel[]> {
  try {
    const response = await axios.get(`${API}?company_id=${companyId}&typeon=${typeon}`);
    return response.data;
  } catch (err) {
    console.error('[Error fetching categories]', err);
    return [];
  }
}
export async function getCategoryById(id: string) {
  try {
    const res = await axios.get<CategoryModel>(`${API}/${id}`);
    return { success: true, category: res.data };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || "Categoría no encontrada",
    };
  }
}
