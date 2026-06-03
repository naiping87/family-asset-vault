"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileMenu } from "@/components/layout/MobileMenu";

const BREAKPOINT = 1280;

interface Props {
  userInfo: { name: string; email: string; initial: string };
  children: React.ReactNode;
}

export function DashboardShell({ userInfo, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    function check() {
      setShowSidebar(window.innerWidth >= BREAKPOINT);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="app-container">
      {showSidebar && <Sidebar userInfo={userInfo} />}
      <TopBar onMenuToggle={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <BottomNav />

      <div className="main-content" style={!showSidebar ? { marginLeft: 0 } : undefined}>
        <div className="main-inner">{children}</div>
      </div>
    </div>
  );
}
