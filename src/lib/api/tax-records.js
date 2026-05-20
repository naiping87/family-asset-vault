import { getSupabaseBrowser } from '@/lib/supabase/client';

const TABLE = 'tax_records';

export async function listTaxRecords(propertyId) {
  const supabase = getSupabaseBrowser();
  if (!supabase) return [];

  const { data, error } = await supabase.from(TABLE).select('*').eq('property_id', propertyId).order('due_date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addTaxRecord(record) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { data, error } = await supabase.from(TABLE).insert(record).select().single();
  if (error) throw error;
  return data;
}

export async function updateTaxRecord(id, updates) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function markTaxPaid(id, paidDate) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { data, error } = await supabase.from(TABLE).update({ paid: true, paid_date: paidDate || new Date().toISOString().split('T')[0] }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function removeTaxRecord(id) {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase 未配置');

  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
