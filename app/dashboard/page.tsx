import { getGreeting, formatFullDate } from "@/lib/utils/formatters";
import { getDashboardStats, getReminders, getRecentProperties } from "@/lib/api/dashboard";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/features/DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, language")
    .eq("id", user?.id ?? "")
    .single();

  const greeting = getGreeting(profile?.language || "zh");
  const today = formatFullDate(new Date());
  const stats = await getDashboardStats();
  const reminders = await getReminders();
  const recentProperties = await getRecentProperties(4);

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
