import { create } from 'zustand';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from '../services/productServices';
import type { ProductModel } from '../models/productModels';

interface ProductState {
  products: ProductModel[];
  fetchAll: (companyId: string) => Promise<void>;
  create: (data: FormData) => Promise<boolean>;
  update: (id: string, data: FormData) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  fetchProductsByCategory: (categoryId: string) => Promise<void>;
  getById: (id: string) => Promise<ProductModel | null>;
  logout: () => void;

}
export const useProductStore = create<ProductState>((set, get) => ({
     products: [],
    logout: () => set({ products: [] }),

// Dentro de create:
    fetchProductsByCategory: async (categoryId: string) => {
    // Asumimos que fetchProducts acepta categoryId opcional para filtrar
    const res = await fetchProducts(undefined, categoryId); // companyId no necesario aquí o puedes pasar si quieres
    if (res.success) {
        set({ products: res.products });
    } else {
        console.error(res.error);
    }
    },
  fetchAll: async (companyId: string) => {
    const res = await fetchProducts(companyId);
    if (res.success) {
      set({ products: res.products });
    } else {
      console.error(res.error);
    }
  },
  getById: async (id) => {
    return await getProductById(id);
  },
  create: async (data: FormData) => {
    const res = await createProduct(data);
    if (res.success && res.product) {
      set((state) => ({
        products: [res.product, ...state.products],
      }));
      return true;
    }
    console.error(res.error);
    return false;
  },

  update: async (id: string, data: FormData) => {
    const res = await updateProduct(id, data);
    if (res.success && res.product) {
      const updatedProducts = get().products.map((p) =>
        p.id_product === id ? res.product! : p
      );
      set({ products: updatedProducts });
      return true;
    }
    console.error(res.error);
    return false;
  },

  remove: async (id: string) => {
    const res = await deleteProduct(id);
    if (res.success) {
      set((state) => ({
        products: state.products.filter((p) => p.id_product !== id),
      }));
      return true;
    }
    console.error(res.error);
    return false;
  },
}));
