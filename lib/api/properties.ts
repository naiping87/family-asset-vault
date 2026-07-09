import { createClient } from "@/lib/supabase/server";
import type { Property, CoOwner } from "@/types/database";

export async function getProperties() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("properties")
    .select("*, tenancies(monthly_rent, status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return (data as (Property & { tenancies?: { monthly_rent: number | null; status: string }[] })[]) ?? [];
}

export async function getProperty(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!property) return null;

  const { data: coOwners } = await supabase
    .from("co_owners")
    .select("*")
    .eq("property_id", id);

  const { data: tenancies } = await supabase
    .from("tenancies")
    .select("*")
    .eq("property_id", id)
    .order("created_at", { ascending: false });

  const { data: taxes } = await supabase
    .from("taxes")
    .select("*")
    .eq("property_id", id)
    .order("due_date", { ascending: true });

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("property_id", id)
    .order("due_date", { ascending: true });

  return {
    ...(property as Property),
    co_owners: (coOwners as CoOwner[]) ?? [],
    tenancies: tenancies ?? [],
    taxes: taxes ?? [],
    expenses: expenses ?? [],
  };
}

export async function createProperty(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  // Parse photos JSON array from hidden input
  let photos: string[] = [];
  const photosRaw = formData.get("photos") as string;
  if (photosRaw) {
    try { photos = JSON.parse(photosRaw); } catch { photos = []; }
  }

  const entry = {
    user_id: user.id,
    name: formData.get("name") as string,
    property_type: formData.get("property_type") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    postcode: formData.get("postcode") as string,
    purchase_price: formData.get("purchase_price") ? Number(formData.get("purchase_price")) : null,
    current_value: formData.get("current_value") ? Number(formData.get("current_value")) : null,
    loan_balance: formData.get("loan_balance") ? Number(formData.get("loan_balance")) : null,
    loan_installment: formData.get("loan_installment") ? Number(formData.get("loan_installment")) : null,
    loan_interest_rate: formData.get("loan_interest_rate") ? Number(formData.get("loan_interest_rate")) : null,
    loan_bank: (formData.get("loan_bank") as string) || null,
    title_deed_no: (formData.get("title_deed_no") as string) || null,
    tax_account_no: (formData.get("tax_account_no") as string) || null,
    tax_authority: (formData.get("tax_authority") as string) || null,
    spa_file_url: (formData.get("spa_file_url") as string) || null,
    geran_file_url: (formData.get("geran_file_url") as string) || null,
    photos,
    status: formData.get("status") as string,
  };

  const { data, error } = await supabase
    .from("properties")
    .insert(entry)
    .select()
    .single();

  if (error) return { error: error.message };
  return { property: data as Property };
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  let photos: string[] = [];
  const photosRaw = formData.get("photos") as string;
  if (photosRaw) {
    try { photos = JSON.parse(photosRaw); } catch { photos = []; }
  }

  const entry = {
    name: formData.get("name") as string,
    property_type: formData.get("property_type") as string,
    address: (formData.get("address") as string) || null,
    city: (formData.get("city") as string) || null,
    state: (formData.get("state") as string) || null,
    postcode: (formData.get("postcode") as string) || null,
    purchase_price: formData.get("purchase_price") ? Number(formData.get("purchase_price")) : null,
    current_value: formData.get("current_value") ? Number(formData.get("current_value")) : null,
    loan_balance: formData.get("loan_balance") ? Number(formData.get("loan_balance")) : null,
    loan_installment: formData.get("loan_installment") ? Number(formData.get("loan_installment")) : null,
    loan_interest_rate: formData.get("loan_interest_rate") ? Number(formData.get("loan_interest_rate")) : null,
    loan_bank: (formData.get("loan_bank") as string) || null,
    title_deed_no: (formData.get("title_deed_no") as string) || null,
    tax_account_no: (formData.get("tax_account_no") as string) || null,
    tax_authority: (formData.get("tax_authority") as string) || null,
    spa_file_url: (formData.get("spa_file_url") as string) || null,
    geran_file_url: (formData.get("geran_file_url") as string) || null,
    photos,
    status: formData.get("status") as string,
  };

  const { error } = await supabase
    .from("properties")
    .update(entry)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
