'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function MobileMenuDrawer({ open, onClose }) {
  const { user, signOut, signInWithGoogle } = useAuth();
  const router = useRouter();

  if (!open) return null;

  const navTo = (path) => {
    router.push(path);
    onClose();
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '用户';
  const email = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="dialog-overlay" onClick={onClose} style={{ zIndex: 300 }}>
      <div
        style={{
          position: 'fixed', left: 0, top: 0, bottom: 0, width: 280,
          background: 'var(--glass-bg-intense)', backdropFilter: 'blur(40px)',
          padding: 24, borderRight: '1px solid var(--glass-border)',
          overflowY: 'auto', zIndex: 300,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>菜单</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-primary)' }}>✕</button>
        </div>
        <button className="nav-item active" onClick={() => navTo('/')}><span className="icon">📊</span> 仪表盘</button>
        <button className="nav-item" onClick={() => navTo('/properties')}><span className="icon">🏘️</span> 我的房产</button>
        <button className="nav-item" onClick={() => navTo('/insurances')}><span className="icon">🛡️</span> 我的保险</button>
        <button className="nav-item" onClick={() => navTo('/settings')}><span className="icon">⚙️</span> 账户设置</button>

        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--glass-border)', marginTop: 32 }}>
          {user ? (
            <>
              <div className="user-info">
                <div className="user-avatar">{initial}</div>
                <div>
                  <div className="user-name">{displayName}</div>
                  <div className="user-email">{email}</div>
                </div>
              </div>
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
      </div>
    </div>
  );
}
