import { createClient } from "@/lib/supabase/server";
import type { Tax } from "@/types/database";

export async function createTax(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const entry = {
    property_id: formData.get("property_id") as string,
    tax_type: formData.get("tax_type") as string,
    authority: (formData.get("authority") as string) || null,
    account_no: (formData.get("account_no") as string) || null,
    amount: formData.get("amount") ? Number(formData.get("amount")) : null,
    due_date: (formData.get("due_date") as string) || null,
    status: "unpaid",
  };

  const { data, error } = await supabase
    .from("taxes")
    .insert(entry)
    .select()
    .single();

  if (error) return { error: error.message };
  return { tax: data as Tax };
}

export async function markTaxPaid(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const { error } = await supabase
    .from("taxes")
    .update({
      status: "paid",
      paid_date: new Date().toISOString().split("T")[0],
    })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteTax(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const { error } = await supabase
    .from("taxes")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
