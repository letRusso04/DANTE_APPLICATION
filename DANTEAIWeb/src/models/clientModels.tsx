export interface ClientModel {
  id: string;
  company_id: string;
  category_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  document_type?: string;
  document_number?: string;
  avatar?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
