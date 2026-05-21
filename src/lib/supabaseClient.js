import { createClient } from "@supabase/supabase-js";

const id = import.meta.env.VITE_SUPA_ID_PROD;
const anonKey = import.meta.env.VITE_SUPA_ANON_PROD;

export const supabase = createClient(
  "https://"+id+".supabase.co",
  anonKey
);
