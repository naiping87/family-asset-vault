"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { UserInfo } from "./UserInfo";
import { ThemeToggle } from "./ThemeToggle";

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: string;
}

const mainNav: NavItem[] = [
  { icon: "📊", label: "仪表盘", href: "/dashboard" },
  { icon: "🏘️", label: "我的房产", href: "/dashboard/properties", badge: "4" },
  { icon: "🛡️", label: "我的保险", href: "/dashboard/insurances" },
];

const otherNav: NavItem[] = [
  { icon: "⚙️", label: "账户设置", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

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
            className={cn("nav-item", pathname === item.href && "active")}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
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
        <UserInfo name="张先生" email="zhang@email.com" initial="张" />
        <ThemeToggle />
        <button className="logout-btn">
          <span>🚪</span> 退出登录
        </button>
      </div>
    </aside>
  );
}
