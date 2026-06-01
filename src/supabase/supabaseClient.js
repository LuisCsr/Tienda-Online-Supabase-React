import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validación en consola
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Error crítico: Las variables de entorno de Supabase no se cargaron en la aplicación.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);