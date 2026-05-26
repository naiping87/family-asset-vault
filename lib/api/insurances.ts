import { createClient } from "@/lib/supabase/server";
import type { Insurance } from "@/types/database";

export async function getInsurances() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("insurances")
    .select("*, properties(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getInsurance(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("insurances")
    .select("*, properties(name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  return data;
}

export async function createInsurance(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const entry = {
    user_id: user.id,
    property_id: (formData.get("property_id") as string) || null,
    insurance_type: formData.get("insurance_type") as string,
    provider: formData.get("provider") as string,
    policy_no: formData.get("policy_no") as string,
    coverage_amount: formData.get("coverage_amount") ? Number(formData.get("coverage_amount")) : null,
    annual_premium: formData.get("annual_premium") ? Number(formData.get("annual_premium")) : null,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    agent_name: (formData.get("agent_name") as string) || null,
    agent_phone: (formData.get("agent_phone") as string) || null,
    status: formData.get("status") as string || "active",
  };

  const { data, error } = await supabase
    .from("insurances")
    .insert(entry)
    .select()
    .single();

  if (error) return { error: error.message };
  return { insurance: data as Insurance };
}

export async function deleteInsurance(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const { error } = await supabase
    .from("insurances")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
