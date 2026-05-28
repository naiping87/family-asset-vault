"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { validatePassword } from "@/lib/auth/validation";

export async function signIn(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUp(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  const pwError = validatePassword(password);
  if (pwError) return { error: pwError };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: error.message };

  if (data.user?.identities?.length === 0) {
    redirect("/register/confirm");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPassword(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login/reset-password`,
  });
  if (error) return { error: error.message };

  return { success: "密码重置链接已发送至您的邮箱，请查收邮件" };
}

export async function updatePassword(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const pwError = validatePassword(password);
  if (pwError) return { error: pwError };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function changePassword(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const currentPassword = formData.get("current_password") as string;
  const newPassword = formData.get("new_password") as string;

  if (!currentPassword) return { error: "请输入当前密码" };
  const pwError = validatePassword(newPassword);
  if (pwError) return { error: pwError };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { error: "未登录" };

  // Re-authenticate first, then update password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) return { error: "当前密码错误" };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };

  return { success: "密码修改成功" };
}
