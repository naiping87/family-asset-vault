import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const displayName = (formData.get("display_name") as string) || undefined;
  const preferredCurrency = (formData.get("preferred_currency") as string) || undefined;

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      display_name: displayName,
      preferred_currency: preferredCurrency,
      updated_at: new Date().toISOString(),
    });

  if (error) return { error: error.message };
  return { success: true };
}
