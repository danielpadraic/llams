import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client once
export const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
);