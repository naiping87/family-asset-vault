"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/lib/utils/icons";

interface TopBarProps {
  onMenuToggle: () => void;
}

const titles: Record<string, string> = {
  "/dashboard": "仪表盘",
  "/dashboard/properties": "房产",
  "/dashboard/insurances": "保险",
  "/dashboard/settings": "设置",
};

export function TopBar({ onMenuToggle }: TopBarProps) {
  const pathname = usePathname();

  let title = "Family Asset Vault";
  for (const [path, label] of Object.entries(titles)) {
    if (pathname.startsWith(path)) { title = label; break; }
  }

  return (
    <div className="top-bar glass-intense mobile-only">
      <button className="btn btn-secondary btn-icon" onClick={onMenuToggle} type="button" aria-label="菜单">
        <Icon name="Menu" size={22} />
      </button>
      <span style={{ fontWeight: 700, fontSize: 17 }}>{title}</span>
      <div style={{ width: 40 }} />
    </div>
  );
}
