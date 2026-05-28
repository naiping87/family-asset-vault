"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/lib/utils/icons";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useT();

  const items = [
    { icon: "Dashboard", label: t("nav.dashboard"), href: "/dashboard" },
    { icon: "Properties", label: t("nav.properties"), href: "/dashboard/properties" },
    { icon: "Shield", label: t("nav.insurances"), href: "/dashboard/insurances" },
    { icon: "Settings", label: t("nav.settings"), href: "/dashboard/settings" },
  ];

  return (
    <nav className="bottom-nav glass-intense">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn("bottom-nav-item", pathname === item.href && "active")}
        >
          <span className="icon"><Icon name={item.icon} size={20} /></span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
