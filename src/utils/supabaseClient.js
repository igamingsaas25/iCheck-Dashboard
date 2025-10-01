import { createClient } from '@supabase/supabase-js';

// These variables will be sourced from your environment variables.
// In a Vite project, you create a .env file in the root and add:
// VITE_SUPABASE_URL=your-supabase-project-url
// VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL and/or Anon Key are missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);