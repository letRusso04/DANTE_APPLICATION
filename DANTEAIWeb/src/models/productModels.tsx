export interface ProductModel {
  id_product: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  is_active: boolean;
  category_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}
