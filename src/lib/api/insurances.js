import { getSupabaseBrowser } from '@/lib/supabase/client';

const TABLE = 'insurances';

export async function listInsurances(filters = {}) {
  const supabase = getSupabaseBrowser();
  if (!supabase) return [];

  let query = supabase.from(TABLE).select('*, properties(name, type)').order('created_at', { ascending: false });

  if (filters.propertyId) {
    query = query.eq('property_id', filters.propertyId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createInsurance(insurance) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { data, error } = await supabase.from(TABLE).insert(insurance).select().single();
  if (error) throw error;
  return data;
}

export async function updateInsurance(id, updates) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteInsurance(id) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
