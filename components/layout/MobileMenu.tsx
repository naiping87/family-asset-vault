"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/lib/utils/icons";
import { signOut } from "@/lib/auth/actions";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { t } = useT();

  if (!open) return null;

  const navItems = [
    { icon: "Dashboard", label: t("nav.dashboard"), href: "/dashboard" },
    { icon: "Properties", label: t("nav.properties"), href: "/dashboard/properties" },
    { icon: "Shield", label: t("nav.insurances"), href: "/dashboard/insurances" },
    { icon: "Settings", label: t("nav.settings"), href: "/dashboard/settings" },
  ];

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 280,
          background: "var(--glass-bg-intense)",
          backdropFilter: "blur(40px)",
          padding: 24,
          borderRight: "1px solid var(--glass-border)",
          overflowY: "auto",
          zIndex: 300,
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18 }}>{t("nav.menu")}</div>
          <button
            onClick={onClose}
            type="button"
            aria-label={t("common.close")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-primary)",
              padding: 4,
            }}
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-item", pathname === item.href && "active")}
            onClick={onClose}
          >
            <span className="icon"><Icon name={item.icon} size={20} /></span>
            {item.label}
          </Link>
        ))}

        <div style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid var(--glass-border)" }}>
          <form action={signOut}>
            <button className="logout-btn" type="submit">
              <span><Icon name="LogOut" size={18} /></span> {t("nav.logout")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
