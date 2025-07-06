export interface UserModel {
  id_user: string;
  name: string;
  email: string;
  phone?: string;
  job_title?: string;
  gender?: string;
  birth_date?: string;
  role: 'Usuario' | 'Soporte' | 'Operador' | 'Propietario' | 'Programador';
  avatar_url?: string;
  is_active?: boolean;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  company_id: string;
  company?: any; // si incluyes la info de la empresa al logear
}