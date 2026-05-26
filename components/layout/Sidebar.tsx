"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { UserInfo } from "./UserInfo";
import { ThemeToggle } from "./ThemeToggle";
import { signOut } from "@/lib/auth/actions";

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

const mainNav: NavItem[] = [
  { icon: "📊", label: "仪表盘", href: "/dashboard" },
  { icon: "🏘️", label: "我的房产", href: "/dashboard/properties" },
  { icon: "🛡️", label: "我的保险", href: "/dashboard/insurances" },
];

const otherNav: NavItem[] = [
  { icon: "⚙️", label: "账户设置", href: "/dashboard/settings" },
];

interface Props {
  userInfo: { name: string; email: string; initial: string };
}

export function Sidebar({ userInfo }: Props) {
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
        <UserInfo name={userInfo.name} email={userInfo.email} initial={userInfo.initial} />
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
