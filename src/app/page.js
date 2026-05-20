'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { getGreeting, getTodayDescription } from '@/lib/utils/format';
import LoginDialog from '@/components/auth/LoginDialog';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        加载中...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20 }}>
        <div style={{ fontSize: 48 }}>🏰</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>Family Asset Vault</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 300 }}>
          一站式管理您的家庭资产<br />房产 · 保险 · 税务 · 租约
        </p>
        <button className="btn btn-primary" onClick={() => setShowLogin(true)} style={{ marginTop: 12 }}>
          登录以开始使用
        </button>
        <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '用户';

  return (
    <>
      <div className="greeting">
        <div className="greeting-text">{getGreeting()}，{displayName} 👋</div>
        <div className="greeting-date">{getTodayDescription()}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon blue">📊</div>
          <div className="stat-label">总资产估值</div>
          <div className="stat-value">—</div>
          <div className="stat-sub">添加房产后显示</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon amber">🏦</div>
          <div className="stat-label">贷款余额</div>
          <div className="stat-value">—</div>
          <div className="stat-sub">添加房产后显示</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon green">🏘️</div>
          <div className="stat-label">房产总数</div>
          <div className="stat-value">0</div>
          <div className="stat-sub">开始添加您的第一处房产</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon purple">💰</div>
          <div className="stat-label">月租金收入</div>
          <div className="stat-value">—</div>
          <div className="stat-sub">添加租约后显示</div>
        </div>
      </div>

      <div className="content-grid-2">
        <div className="section-panel glass">
          <div className="section-header">
            <div className="section-title">⚠️ 即将到期提醒</div>
          </div>
          <div className="reminder-list">
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20, fontSize: 14 }}>
              暂无到期提醒
            </div>
          </div>
        </div>

        <div className="section-panel glass">
          <div className="section-header">
            <div className="section-title">⚡ 快捷操作</div>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => window.location.href = '/properties/new'}>
              <span className="icon blue">🏠</span>
              <span className="quick-action-label">添加房产</span>
            </button>
            <button className="quick-action-btn" onClick={() => window.location.href = '/insurances/new'}>
              <span className="icon green">🛡️</span>
              <span className="quick-action-label">添加保险</span>
            </button>
            <button className="quick-action-btn" onClick={() => window.location.href = '/properties'}>
              <span className="icon amber">📝</span>
              <span className="quick-action-label">记录税务</span>
            </button>
            <button className="quick-action-btn" onClick={() => window.location.href = '/properties'}>
              <span className="icon purple">📋</span>
              <span className="quick-action-label">新建租约</span>
            </button>
          </div>
        </div>
      </div>

      <div className="section-panel glass">
        <div className="section-header">
          <div className="section-title">📋 最近资产</div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24, fontSize: 14 }}>
          还没有添加任何房产
        </div>
      </div>
    </>
  );
}
