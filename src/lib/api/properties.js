import { getSupabaseBrowser } from '@/lib/supabase/client';

const TABLE = 'properties';

export async function listProperties(filters = {}) {
  const supabase = getSupabaseBrowser();
  if (!supabase) return { data: [], error: null };

  let query = supabase.from(TABLE).select('*').order('created_at', { ascending: false });

  if (filters.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }
  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getProperty(id) {
  const supabase = getSupabaseBrowser();
  if (!supabase) return null;

  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createProperty(property) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { data, error } = await supabase.from(TABLE).insert(property).select().single();
  if (error) throw error;
  return data;
}

export async function updateProperty(id, updates) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProperty(id) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function getDashboardStats() {
  const supabase = getSupabaseBrowser();
  if (!supabase) return null;

  const { data, error } = await supabase.from('dashboard_stats').select('*').single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || { total_properties: 0, total_value: 0, total_loan: 0, monthly_rental_income: 0, rented_count: 0, vacant_count: 0, non_rental_count: 0 };
}
