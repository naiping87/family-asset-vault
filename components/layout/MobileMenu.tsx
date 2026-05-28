"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/lib/utils/icons";
import { signOut } from "@/lib/auth/actions";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  userInfo: { name: string; email: string; initial: string };
}

const navItems = [
  { icon: "Dashboard", label: "仪表盘", href: "/dashboard" },
  { icon: "Properties", label: "我的房产", href: "/dashboard/properties" },
  { icon: "Shield", label: "我的保险", href: "/dashboard/insurances" },
  { icon: "Settings", label: "账户设置", href: "/dashboard/settings" },
];

export function MobileMenu({ open, onClose, userInfo }: MobileMenuProps) {
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
          <div style={{ fontWeight: 700, fontSize: 18 }}>菜单</div>
          <button
            onClick={onClose}
            type="button"
            aria-label="关闭"
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

        <div
          style={{
            marginTop: "auto",
            paddingTop: 24,
            borderTop: "1px solid var(--glass-border)",
          }}
        >
          <div className="user-info">
            <div className="user-avatar">{userInfo.initial}</div>
            <div>
              <div className="user-name">{userInfo.name}</div>
              <div className="user-email">{userInfo.email}</div>
            </div>
          </div>
          <form action={signOut}>
            <button className="logout-btn" type="submit">
              <span><Icon name="LogOut" size={18} /></span> 退出登录
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
