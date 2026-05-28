"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();

  const mainNav: NavItem[] = [
    { icon: "Dashboard", label: t("nav.dashboard"), href: "/dashboard" },
    { icon: "Properties", label: t("nav.properties"), href: "/dashboard/properties" },
    { icon: "Shield", label: t("nav.insurances"), href: "/dashboard/insurances" },
  ];

  const otherNav: NavItem[] = [
    { icon: "Settings", label: t("nav.settings"), href: "/dashboard/settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <Icon name="Castle" size={28} />
        </div>
        <div className="logo-text">
          Family Asset<span>Vault</span>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-label">{t("nav.mainNav")}</div>
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-item", pathname.startsWith(item.href) && "active")}
          >
            <span className="icon"><Icon name={item.icon} size={20} /></span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="nav-section">
        <div className="nav-label">{t("nav.other")}</div>
        {otherNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-item", pathname === item.href && "active")}
          >
            <span className="icon"><Icon name={item.icon} size={20} /></span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <UserInfo name={userInfo.name} email={userInfo.email} initial={userInfo.initial} />
        <ThemeToggle />
        <form action={signOut}>
          <button className="logout-btn" type="submit">
            <span><Icon name="LogOut" size={18} /></span> {t("nav.logout")}
          </button>
        </form>
      </div>
    </aside>
  );
}
