"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/lib/utils/icons";

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    { icon: "Dashboard", href: "/dashboard" },
    { icon: "Properties", href: "/dashboard/properties" },
    { icon: "Shield", href: "/dashboard/insurances" },
    { icon: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <nav className="bottom-nav glass-intense desktop-hidden">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn("bottom-nav-item", pathname === item.href && "active")}
          aria-label={item.icon}
        >
          <span className="icon"><Icon name={item.icon} size={20} /></span>
        </Link>
      ))}
    </nav>
  );
}
