// src/supabase/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Vite expone las variables de entorno con el prefijo VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Check your .env.local file.");
}

// Exporta el cliente para usarlo en toda la aplicación
export const supabase = createClient(supabaseUrl, supabaseAnonKey);