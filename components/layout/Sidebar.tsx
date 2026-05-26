"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { UserInfo } from "./UserInfo";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth/actions";

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: string;
}

const mainNav: NavItem[] = [
  { icon: "📊", label: "仪表盘", href: "/dashboard" },
  { icon: "🏘️", label: "我的房产", href: "/dashboard/properties" },
  { icon: "🛡️", label: "我的保险", href: "/dashboard/insurances" },
];

const otherNav: NavItem[] = [
  { icon: "⚙️", label: "账户设置", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string; initial: string }>({
    name: "用户",
    email: "",
    initial: "U",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const name = data.user.user_metadata?.full_name
          || data.user.user_metadata?.display_name
          || data.user.email?.split("@")[0]
          || "用户";
        setUser({
          name,
          email: data.user.email ?? "",
          initial: name.charAt(0).toUpperCase(),
        });
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name = session.user.user_metadata?.full_name
          || session.user.user_metadata?.display_name
          || session.user.email?.split("@")[0]
          || "用户";
        setUser({
          name,
          email: session.user.email ?? "",
          initial: name.charAt(0).toUpperCase(),
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">🏰</div>
        <div className="logo-text">
          Family Asset<span>Vault</span>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-label">主导航</div>
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-item", pathname.startsWith(item.href) && "active")}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="nav-section">
        <div className="nav-label">其他</div>
        {otherNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-item", pathname === item.href && "active")}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <UserInfo name={user.name} email={user.email} initial={user.initial} />
        <ThemeToggle />
        <form action={signOut}>
          <button className="logout-btn" type="submit">
            <span>🚪</span> 退出登录
          </button>
        </form>
      </div>
    </aside>
  );
}
