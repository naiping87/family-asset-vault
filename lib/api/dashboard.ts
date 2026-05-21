import { createClient } from "@/lib/supabase/server";
import { daysUntil } from "@/lib/utils/formatters";

export interface DashboardStats {
  total_properties: number;
  rented_count: number;
  vacant_count: number;
  non_rental_count: number;
  total_value: number;
  total_loan: number;
  monthly_rental_income: number;
  active_insurances: number;
}

export interface Reminder {
  title: string;
  sub: string;
  days: number;
  type: "danger" | "warning" | "info";
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("dashboard_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!data) return null;
  return data as DashboardStats;
}

export async function getReminders(): Promise<Reminder[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const now = new Date();
  const reminders: Reminder[] = [];

  // Expiring insurances (within 60 days)
  const { data: insurances } = await supabase
    .from("insurances")
    .select("*, properties(name)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("end_date", { ascending: true });

  if (insurances) {
    for (const ins of insurances) {
      const days = daysUntil(ins.end_date);
      if (days <= 60) {
        reminders.push({
          title: `${ins.insurance_type === "fire" ? "火险" : ins.insurance_type === "home" ? "房屋保险" : "保险"}即将到期`,
          sub: `${ins.provider} · ${ins.policy_no} · ${ins.properties?.name ?? ""}`,
          days,
          type: days < 0 ? "danger" : days <= 30 ? "warning" : "info",
        });
      }
    }
  }

  // Upcoming tax due dates (within 90 days)
  const { data: taxes } = await supabase
    .from("taxes")
    .select("*, properties(name)")
    .eq("status", "unpaid")
    .order("due_date", { ascending: true });

  if (taxes) {
    for (const tax of taxes) {
      if (!tax.due_date) continue;
      const days = daysUntil(tax.due_date);
      if (days <= 90 && days >= -30) {
        reminders.push({
          title: `${tax.tax_type === "cukai_pintu" ? "门牌税" : tax.tax_type === "cukai_tanah" ? "土地税" : "税务"}缴付截止`,
          sub: `${tax.authority ?? ""} · 账号 ${tax.account_no ?? ""} · ${tax.properties?.name ?? ""}`,
          days,
          type: days < 0 ? "danger" : days <= 14 ? "warning" : "info",
        });
      }
    }
  }

  return reminders.sort((a, b) => a.days - b.days).slice(0, 5);
}

export async function getRecentProperties(limit = 4) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
