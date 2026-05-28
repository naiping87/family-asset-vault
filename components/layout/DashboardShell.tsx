"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileMenu } from "@/components/layout/MobileMenu";

interface Props {
  userInfo: { name: string; email: string; initial: string };
  children: React.ReactNode;
}

export function DashboardShell({ userInfo, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar userInfo={userInfo} />
      <TopBar onMenuToggle={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} userInfo={userInfo} />
      <BottomNav />

      <div className="main-content">
        <div className="main-inner">{children}</div>
      </div>
    </div>
  );
}
