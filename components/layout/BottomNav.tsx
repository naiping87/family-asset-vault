"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const items = [
  { icon: "📊", label: "仪表盘", href: "/dashboard" },
  { icon: "🏘️", label: "房产", href: "/dashboard/properties" },
  { icon: "🛡️", label: "保险", href: "/dashboard/insurances" },
  { icon: "⚙️", label: "设置", href: "/dashboard/settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav glass-intense">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "bottom-nav-item",
            pathname === item.href && "active"
          )}
        >
          <span className="icon">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
