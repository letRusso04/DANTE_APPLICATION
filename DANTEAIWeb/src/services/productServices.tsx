import axios from 'axios';
import { API_URL } from './routes/routesAPI';
import type { ProductModel } from '../models/productModels';


const API = `${API_URL}/products`;

interface FetchProductsResponse {
  success: boolean;
  products: ProductModel[];
  error?: string;
}

export async function getProductById(productId: string) {
  try {
    const res = await axios.get<ProductModel>(`${API_URL}/product/${productId}`);
    return res.data;
  } catch (err) {
    console.error('Error al obtener producto:', err);
    return null;
  }
}
export async function getTopProducts(companyId?: string): Promise<{ success: boolean; products?: ProductModel[]; error?: any }> {
  try {
    const params: Record<string, string> = {};
    if (companyId) params.company_id = companyId;
    const response = await axios.get<ProductModel[]>(API , { params }); 
    return { success: true, products: response.data };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error };
  }
}
export async function fetchProducts(
  companyId?: string,
  categoryId?: string
): Promise<FetchProductsResponse> {
  try {
    const params: Record<string, string> = {};
    if (companyId) params.company_id = companyId;
    if (categoryId) params.category_id = categoryId;

    const res = await axios.get<ProductModel[]>(API , { params });
    return { success: true, products: res.data };
  } catch (err: any) {
    return { success: false, products: [], error: err.message || 'Error fetching products' };
  }
}

export async function createProduct(data: FormData) {
  try {
    const res = await axios.post<ProductModel>(API, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, product: res.data };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || 'Error al crear producto',
    };
  }
}

export async function updateProduct(id: string, data: FormData) {
  try {
    const res = await axios.put<ProductModel>(`${API}/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, product: res.data };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || 'Error al actualizar producto',
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    await axios.delete(`${API}/${id}`);
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || 'Error al eliminar producto',
    };
  }
}
