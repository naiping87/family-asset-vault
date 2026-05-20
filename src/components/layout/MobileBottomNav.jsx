'use client';
import { useRouter, usePathname } from 'next/navigation';

const navItems = [
  { path: '/', label: '仪表盘', icon: '📊' },
  { path: '/properties', label: '房产', icon: '🏘️' },
  { path: '/insurances', label: '保险', icon: '🛡️' },
  { path: '/settings', label: '设置', icon: '⚙️' },
];

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav glass-intense mobile-only">
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}
          onClick={() => router.push(item.path)}
        >
          <span className="icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
