import { getSupabaseBrowser } from '@/lib/supabase/client';

/**
 * 聚合所有到期提醒
 * 包括: 税务截止、保险到期、租约到期
 */
export async function getReminders() {
  const supabase = getSupabaseBrowser();
  if (!supabase) return [];

  const today = new Date().toISOString().split('T')[0];

  const [taxRes, insuranceRes, tenancyRes] = await Promise.all([
    supabase.from('tax_records').select('id, property_id, tax_type, amount, due_date, paid, properties(name, type)').eq('paid', false).order('due_date'),
    supabase.from('insurances').select('id, property_id, type, company, policy_no, end_date, sum_insured, properties(name, type)').gte('end_date', today).order('end_date'),
    supabase.from('tenancies').select('id, property_id, tenant_name, end_date, properties(name, type)').gte('end_date', today).order('end_date'),
  ]);

  const reminders = [];

  if (taxRes.data) {
    taxRes.data.forEach(t => {
      reminders.push({
        id: `tax-${t.id}`,
        type: 'tax',
        title: `${t.tax_type === 'cukai_pintu' ? '🏠 门牌税' : t.tax_type === 'cukai_tanah' ? '🌴 土地税' : '💰 盈利税'} - ${t.properties?.name || ''}`,
        sub: `RM ${t.amount?.toLocaleString() || 0} · 截止 ${t.due_date}`,
        dueDate: t.due_date,
        propertyId: t.property_id,
      });
    });
  }

  if (insuranceRes.data) {
    insuranceRes.data.forEach(i => {
      reminders.push({
        id: `insurance-${i.id}`,
        type: 'insurance',
        title: `${i.type === 'fire' ? '🔥 火险' : i.type === 'flood' ? '🌊 水灾险' : '🛡️ 保险'} - ${i.properties?.name || ''}`,
        sub: `${i.company} · 截止 ${i.end_date}`,
        dueDate: i.end_date,
        propertyId: i.property_id,
      });
    });
  }

  if (tenancyRes.data) {
    tenancyRes.data.forEach(t => {
      reminders.push({
        id: `tenancy-${t.id}`,
        type: 'tenancy',
        title: `📋 租约到期 - ${t.properties?.name || ''}`,
        sub: `${t.tenant_name} · 截止 ${t.end_date}`,
        dueDate: t.end_date,
        propertyId: t.property_id,
      });
    });
  }

  reminders.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  return reminders;
}
