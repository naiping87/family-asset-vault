import { getSupabaseBrowser } from '@/lib/supabase/client';

const TABLE = 'tenancies';

export async function listTenancies(propertyId) {
  const supabase = getSupabaseBrowser();
  if (!supabase) return [];

  const { data, error } = await supabase.from(TABLE).select('*').eq('property_id', propertyId).order('start_date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getActiveTenancy(propertyId) {
  const supabase = getSupabaseBrowser();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('property_id', propertyId)
    .gte('end_date', new Date().toISOString().split('T')[0])
    .order('end_date')
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function addTenancy(tenancy) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { data, error } = await supabase.from(TABLE).insert(tenancy).select().single();
  if (error) throw error;
  return data;
}

export async function updateTenancy(id, updates) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function removeTenancy(id) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
