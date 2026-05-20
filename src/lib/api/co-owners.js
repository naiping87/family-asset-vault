import { getSupabaseBrowser } from '@/lib/supabase/client';

const TABLE = 'co_owners';

export async function listCoOwners(propertyId) {
  const supabase = getSupabaseBrowser();
  if (!supabase) return [];

  const { data, error } = await supabase.from(TABLE).select('*').eq('property_id', propertyId).order('created_at');
  if (error) throw error;
  return data || [];
}

export async function addCoOwner(coOwner) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { data, error } = await supabase.from(TABLE).insert(coOwner).select().single();
  if (error) throw error;
  return data;
}

export async function updateCoOwner(id, updates) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function removeCoOwner(id) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
