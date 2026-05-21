"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: "📊", label: "仪表盘", href: "/dashboard" },
  { icon: "🏘️", label: "我的房产", href: "/dashboard/properties" },
  { icon: "🛡️", label: "我的保险", href: "/dashboard/insurances" },
  { icon: "⚙️", label: "账户设置", href: "/dashboard/settings" },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  if (!open) return null;

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
          <div style={{ fontWeight: 700, fontSize: 18 }}>菜单</div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "var(--text-primary)",
            }}
          >
            ✕
          </button>
        </div>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-item", pathname === item.href && "active")}
            onClick={onClose}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div
          style={{
            marginTop: "auto",
            paddingTop: 24,
            borderTop: "1px solid var(--glass-border)",
          }}
        >
          <div className="user-info">
            <div className="user-avatar">张</div>
            <div>
              <div className="user-name">张先生</div>
              <div className="user-email">zhang@email.com</div>
            </div>
          </div>
          <div className="logout-btn">
            <span>🚪</span> 退出登录
          </div>
        </div>
      </div>
    </div>
  );
}
