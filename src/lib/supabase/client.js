import { createBrowserClient } from '@supabase/ssr';

let supabase = null;

export function getSupabaseBrowser() {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  supabase = createBrowserClient(url, key);
  return supabase;
}
