import { createClient } from "@/lib/supabase/server";
import type { CoOwner } from "@/types/database";

export async function addCoOwner(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const entry = {
    property_id: formData.get("property_id") as string,
    name: formData.get("name") as string,
    email: (formData.get("email") as string) || null,
    ownership_pct: Number(formData.get("ownership_pct") || 0),
    is_primary: formData.get("is_primary") === "true",
  };

  const { data, error } = await supabase
    .from("co_owners")
    .insert(entry)
    .select()
    .single();

  if (error) return { error: error.message };
  return { coOwner: data as CoOwner };
}

export async function removeCoOwner(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const { error } = await supabase
    .from("co_owners")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
