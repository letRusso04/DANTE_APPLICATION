import { create } from "zustand";
import {
  createCategory,
  deleteCategory,
  fetchCategoriesByCompany,

  updateCategory,
} from "../services/categoryServices";
import type { CategoryModel } from "../models/categoryModels";

interface CategoryState {
  categories: CategoryModel[];
  loading: boolean;
  error: string | null;
  logout: () => void;

  fetchCategories: (companyId: string, typeon: string) => Promise<void>;
  addCategory: (data: FormData) => Promise<boolean>;
  editCategory: (id: string, data: FormData) => Promise<boolean>;
  removeCategory: (id: string) => Promise<boolean>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,
  logout: () => set({ categories: [] }),

  fetchCategories: async (companyId: string, typeon: string) => {
    const result = await fetchCategoriesByCompany(companyId, typeon);
    set({ categories: result });
  },

  addCategory: async (data: FormData) => {
    const res = await createCategory(data);
    if (res.success && res.category) {
      set((state) => ({
        categories: [res.category, ...state.categories],
      }));
      window.location.reload();
      return true;
    }
    return false;
  },

  editCategory: async (id, data) => {
    const res = await updateCategory(id, data);
    if (res.success && res.category) {
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id_category === id ? res.category : cat
        ),
      }));
      return true;
    }
    return false;
  },

  removeCategory: async (id) => {
    const res = await deleteCategory(id);
    if (res.success) {
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id_category !== id),
      }));
      return true;
    }
    return false;
  },
}));
