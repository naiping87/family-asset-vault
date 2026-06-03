"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/lib/utils/icons";
import { cn } from "@/lib/utils/cn";
import { ThemeToggle } from "./ThemeToggle";

interface TopBarProps {
  onMenuToggle: () => void;
  userInitial: string;
  userName: string;
}

const links = [
  { href: "/dashboard", label: "仪表盘", icon: "Dashboard" },
  { href: "/dashboard/properties", label: "房产", icon: "Properties" },
  { href: "/dashboard/insurances", label: "保险", icon: "Insurance" },
];

export function TopBar({ onMenuToggle, userInitial, userName }: TopBarProps) {
  const pathname = usePathname();

  return (
    <header className="top-bar glass-intense">
      <div className="top-bar-left">
        <button
          className="btn btn-secondary btn-icon hamburger-btn"
          onClick={onMenuToggle}
          type="button"
          aria-label="菜单"
        >
          <Icon name="Menu" size={22} />
        </button>

        <Link href="/dashboard" className="top-bar-logo">
          <div className="logo-icon" style={{ width: 34, height: 34, borderRadius: 8 }}>
            <Icon name="Landmark" size={18} style={{ color: "white" }} />
          </div>
          <span className="logo-text-desktop" style={{ fontWeight: 700, fontSize: 16, display: "none" }}>
            Family Asset Vault
          </span>
        </Link>

        <nav className="top-bar-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("top-bar-link", pathname.startsWith(link.href) && "active")}
            >
              <Icon name={link.icon} size={18} />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="top-bar-right">
        <ThemeToggle compact />

        <Link
          href="/dashboard/settings"
          className={cn("top-bar-link", pathname === "/dashboard/settings" && "active")}
        >
          <Icon name="Settings" size={18} />
          <span className="desktop-only-inline">设置</span>
        </Link>

        <div className="user-avatar" style={{ width: 32, height: 32, borderRadius: 8, fontSize: 13, flexShrink: 0 }}>
          {userInitial}
        </div>
        <span className="desktop-only-inline" style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
          {userName}
        </span>
      </div>
    </header>
  );
}
