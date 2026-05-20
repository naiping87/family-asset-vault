'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/lib/hooks/useTheme';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar({ propertyCount = 0 }) {
  const { user, signOut, signInWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navTo = (path) => {
    router.push(path);
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '用户';
  const email = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">🏰</div>
        <div className="logo-text">
          Family Asset<span style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>Vault</span>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-label">主导航</div>
        <button className={`nav-item ${isActive('/') && !isActive('/properties') ? 'active' : ''}`} onClick={() => navTo('/')}>
          <span className="icon">📊</span> 仪表盘
        </button>
        <button className={`nav-item ${isActive('/properties') ? 'active' : ''}`} onClick={() => navTo('/properties')}>
          <span className="icon">🏘️</span> 我的房产
          {propertyCount > 0 && <span className="nav-badge">{propertyCount}</span>}
        </button>
        <button className={`nav-item ${isActive('/insurances') ? 'active' : ''}`} onClick={() => navTo('/insurances')}>
          <span className="icon">🛡️</span> 我的保险
        </button>
      </div>

      <div className="nav-section">
        <div className="nav-label">其他</div>
        <button className={`nav-item ${isActive('/settings') ? 'active' : ''}`} onClick={() => navTo('/settings')}>
          <span className="icon">⚙️</span> 账户设置
        </button>
      </div>

      <div className="sidebar-footer">
        {user ? (
          <>
            <div className="user-info">
              <div className="user-avatar">{initial}</div>
              <div>
                <div className="user-name">{displayName}</div>
                <div className="user-email">{email}</div>
              </div>
            </div>
            <button className="theme-row" onClick={toggleTheme}>
              <span>{theme === 'dark' ? '🌙 深色模式' : '☀️ 浅色模式'}</span>
              <div className="theme-toggle"></div>
            </button>
            <button className="logout-btn" onClick={signOut}>
              <span>🚪</span> 退出登录
            </button>
          </>
        ) : (
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={signInWithGoogle}>
            使用 Google 登录
          </button>
        )}
      </div>
    </aside>
  );
}
