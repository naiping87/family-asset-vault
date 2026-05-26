import { createClient } from "@/lib/supabase/server";
import type { Tenancy } from "@/types/database";

export async function createTenancy(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const entry = {
    property_id: formData.get("property_id") as string,
    tenant_name: formData.get("tenant_name") as string,
    tenant_ic: (formData.get("tenant_ic") as string) || null,
    tenant_phone: (formData.get("tenant_phone") as string) || null,
    tenant_email: (formData.get("tenant_email") as string) || null,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    monthly_rent: formData.get("monthly_rent") ? Number(formData.get("monthly_rent")) : null,
    deposit: formData.get("deposit") ? Number(formData.get("deposit")) : null,
    contract_file_url: (formData.get("contract_file_url") as string) || null,
    tenant_passport_url: (formData.get("tenant_passport_url") as string) || null,
    status: "active",
  };

  const { data, error } = await supabase
    .from("tenancies")
    .insert(entry)
    .select()
    .single();

  if (error) return { error: error.message };
  return { tenancy: data as Tenancy };
}

export async function deleteTenancy(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const { error } = await supabase
    .from("tenancies")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
