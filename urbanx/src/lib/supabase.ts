import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ---- Types ----
export interface DBProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  description: string;
  image: string;
  created_at?: string;
}
