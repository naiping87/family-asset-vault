import { getGreeting, formatFullDate } from "@/lib/utils/formatters";
import { getDashboardStats, getReminders, getRecentProperties } from "@/lib/api/dashboard";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/features/DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 并行执行 4 个独立查询,减少页面等待时间(冷启动后尤其明显)
  const [{ data: profile }, stats, reminders, recentProperties] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, language")
      .eq("id", user?.id ?? "")
      .single(),
    getDashboardStats(),
    getReminders(),
    getRecentProperties(4),
  ]);

  const greeting = getGreeting(profile?.language || "zh");
  const today = formatFullDate(new Date());
  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "用户";

  return (
    <DashboardClient
      greeting={greeting}
      displayName={displayName}
      today={today}
      stats={stats as unknown as Record<string, unknown> | null}
      reminders={reminders as unknown as Record<string, unknown>[]}
      recentProperties={recentProperties as unknown as Record<string, unknown>[]}
    />
  );
}
