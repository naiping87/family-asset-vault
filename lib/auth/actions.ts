"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { validatePassword } from "@/lib/auth/validation";

function isNextRedirect(e: unknown): boolean {
  return e instanceof Error && "digest" in e && (e as Record<string, unknown>).digest === "NEXT_REDIRECT";
}

export async function signIn(_prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return { error: "请输入邮箱和密码" };

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return { error: "登录失败: " + (e instanceof Error ? e.message : "未知错误") };
  }
}

export async function signUp(_prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("full_name") as string;

    if (!email || !password) return { error: "请输入邮箱和密码" };

    const pwError = validatePassword(password);
    if (pwError) return { error: pwError };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };

    // If no session, email confirmation is required
    if (!data.session) {
      redirect("/register/confirm?email=" + encodeURIComponent(email));
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return { error: "注册失败: " + (e instanceof Error ? e.message : "未知错误") };
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPassword(_prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    if (!email) return { error: "请输入邮箱地址" };

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://family-asset-vault.vercel.app/login/reset-password`,
    });
    if (error) return { error: error.message };

    return { success: "密码重置链接已发送至您的邮箱，请查收邮件" };
  } catch (e) {
    return { error: "发送失败: " + (e instanceof Error ? e.message : "未知错误") };
  }
}

export async function updatePassword(_prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const password = formData.get("password") as string;

    const pwError = validatePassword(password);
    if (pwError) return { error: pwError };

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    redirect("/login");
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return { error: "更新失败: " + (e instanceof Error ? e.message : "未知错误") };
  }
}

export async function changePassword(_prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const currentPassword = formData.get("current_password") as string;
    const newPassword = formData.get("new_password") as string;

    if (!currentPassword) return { error: "请输入当前密码" };
    const pwError = validatePassword(newPassword);
    if (pwError) return { error: pwError };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return { error: "未登录" };

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) return { error: "当前密码错误" };

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };

    return { success: "密码修改成功" };
  } catch (e) {
    return { error: "修改失败: " + (e instanceof Error ? e.message : "未知错误") };
  }
}
