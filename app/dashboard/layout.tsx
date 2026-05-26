import { DashboardShell } from "@/components/layout/DashboardShell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile for display name
  let profileName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    profileName = profile?.display_name || "";
  }

  const userInfo = {
    name: profileName || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "用户",
    email: user?.email ?? "",
    initial: (profileName || user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase(),
  };

  return <DashboardShell userInfo={userInfo}>{children}</DashboardShell>;
}
