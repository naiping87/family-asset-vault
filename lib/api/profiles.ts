import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const displayName = (formData.get("display_name") as string) || undefined;
  const language = (formData.get("language") as string) || undefined;

  // Update profiles table
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      display_name: displayName,
      updated_at: new Date().toISOString(),
    });

  if (profileError) return { error: profileError.message };

  // Also update auth metadata so sidebar updates in real-time
  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: displayName, display_name: displayName },
  });

  if (authError) return { error: authError.message };
  return { success: true };
}
