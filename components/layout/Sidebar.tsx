"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useT } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/lib/utils/icons";
import { UserInfo } from "./UserInfo";
import { ThemeToggle } from "./ThemeToggle";
import { signOut } from "@/lib/auth/actions";

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

interface Props {
  userInfo: { name: string; email: string; initial: string };
}

export function Sidebar({ userInfo }: Props) {
  const pathname = usePathname();
  const { t } = useT();
  const [locked, setLocked] = useState(false);

  const mainNav: NavItem[] = [
    { icon: "Dashboard", label: t("nav.dashboard"), href: "/dashboard" },
    { icon: "Properties", label: t("nav.properties"), href: "/dashboard/properties" },
    { icon: "Shield", label: t("nav.insurances"), href: "/dashboard/insurances" },
  ];

  const otherNav: NavItem[] = [
    { icon: "Settings", label: t("nav.settings"), href: "/dashboard/settings" },
  ];

  useEffect(() => {
    const expanded = !locked;
    document.body.classList.toggle("sidebar-collapsed", expanded);
    return () => document.body.classList.remove("sidebar-collapsed");
  }, [locked]);

  return (
    <aside className={cn("sidebar", locked && "expanded")}>
      <button
        className="sidebar-toggle"
        onClick={() => setLocked(!locked)}
        type="button"
        aria-label={locked ? "收起侧边栏" : "固定侧边栏"}
      >
        <Icon name={locked ? "X" : "ChevronRight"} size={16} />
      </button>

      <div className="logo">
        <div className="logo-icon">
          <Icon name="Castle" size={24} />
        </div>
        <div className="logo-text">
          Family Asset<span>Vault</span>
        </div>
      </div>

      <div className="nav-section">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-item", pathname.startsWith(item.href) && "active")}
          >
            <span className="icon"><Icon name={item.icon} size={20} /></span>
            <span>{item.label}</span>
          </Link>
        ))}
        {otherNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-item", pathname === item.href && "active")}
          >
            <span className="icon"><Icon name={item.icon} size={20} /></span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <UserInfo name={userInfo.name} email={userInfo.email} initial={userInfo.initial} />
        <ThemeToggle />
        <form action={signOut}>
          <button className="logout-btn" type="submit">
            <span className="icon"><Icon name="LogOut" size={18} /></span>
            <span>{t("nav.logout")}</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
