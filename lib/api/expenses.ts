import { createClient } from "@/lib/supabase/server";
import type { Expense } from "@/types/database";

export async function getExpenses(propertyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("expenses")
    .select("*")
    .eq("property_id", propertyId)
    .order("due_date", { ascending: true });

  return (data as Expense[]) ?? [];
}

export async function createExpense(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const entry = {
    property_id: formData.get("property_id") as string,
    expense_type: formData.get("expense_type") as string,
    description: (formData.get("description") as string) || null,
    amount: formData.get("amount") ? Number(formData.get("amount")) : null,
    due_date: (formData.get("due_date") as string) || null,
    receipt_url: (formData.get("receipt_url") as string) || null,
    notes: (formData.get("notes") as string) || null,
    status: "unpaid",
  };

  const { data, error } = await supabase
    .from("expenses")
    .insert(entry)
    .select()
    .single();

  if (error) return { error: error.message };
  return { expense: data as Expense };
}

export async function updateExpense(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const entry: Record<string, unknown> = {};
  const textFields = ["expense_type", "description", "due_date", "receipt_url", "notes"];
  for (const f of textFields) {
    const v = formData.get(f);
    if (v !== null && v !== "") entry[f] = v;
  }
  if (formData.get("amount")) entry.amount = Number(formData.get("amount"));

  const { error } = await supabase
    .from("expenses")
    .update(entry)
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function markExpensePaid(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const { error } = await supabase
    .from("expenses")
    .update({
      status: "paid",
      paid_date: new Date().toISOString().split("T")[0],
    })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
