import { createClient } from "@supabase/supabase-js";

const id = import.meta.env.VITE_SUPA_ID;
const anonKey = import.meta.env.VITE_SUPA_ANON;

export const supabase = createClient(
  "https://"+id+".supabase.co",
  anonKey
);
