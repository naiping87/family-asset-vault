'use client';
import { useState } from 'react';
import { AuthProvider } from '@/lib/hooks/useAuth';
import Sidebar from './Sidebar';
import MobileTopBar from './MobileTopBar';
import MobileBottomNav from './MobileBottomNav';
import MobileMenuDrawer from './MobileMenuDrawer';

export default function LayoutShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="app-container">
        <Sidebar />
        <MobileTopBar onMenuClick={() => setMenuOpen(true)} />
        <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

        <div className="main-content">
          <div className="main-inner" id="mainContent">
            {children}
          </div>
        </div>

        <MobileBottomNav />
      </div>
    </AuthProvider>
  );
}
