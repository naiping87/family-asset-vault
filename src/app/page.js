'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useDashboardStats } from '@/lib/hooks/useProperties';
import { useProperties } from '@/lib/hooks/useProperties';
import { useReminders } from '@/lib/hooks/useReminders';
import { getGreeting, getTodayDescription, formatRM, daysRemaining } from '@/lib/utils/format';
import { getReminderSeverity } from '@/lib/utils/constants';
import LoginDialog from '@/components/auth/LoginDialog';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: recentProperties } = useProperties();
  const { data: reminders, loading: remLoading } = useReminders();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
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
  const s = stats || {};
  const recentList = recentProperties.slice(0, 4);

  return (
    <>
      <div className="greeting">
        <div className="greeting-text">{getGreeting()}，{displayName} 👋</div>
        <div className="greeting-date">{getTodayDescription()}</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon blue">📊</div>
          <div className="stat-label">总资产估值</div>
          <div className="stat-value">{statsLoading ? '...' : formatRM(s.total_value, true)}</div>
          <div className="stat-sub">{s.total_properties > 0 ? `${s.total_properties} 处房产` : '添加房产后显示'}</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon amber">🏦</div>
          <div className="stat-label">贷款余额</div>
          <div className="stat-value">{statsLoading ? '...' : formatRM(s.total_loan, true)}</div>
          <div className="stat-sub">{s.total_value > 0 ? `LVR ${((s.total_loan / s.total_value) * 100).toFixed(1)}%` : '—'}</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon green">🏘️</div>
          <div className="stat-label">房产总数</div>
          <div className="stat-value">{s.total_properties || 0} 处</div>
          <div className="stat-sub">{s.rented_count || 0} 出租 · {s.vacant_count || 0} 空置 · {s.non_rental_count || 0} 非出租</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon purple">💰</div>
          <div className="stat-label">月租金收入</div>
          <div className="stat-value">{statsLoading ? '...' : formatRM(s.monthly_rental_income, true)}</div>
          <div className="stat-sub">{s.monthly_rental_income > 0 ? `年收入 ${formatRM(s.monthly_rental_income * 12, true)}` : '添加租约后显示'}</div>
        </div>
      </div>

      {/* Reminders + Quick Actions */}
      <div className="content-grid-2">
        <div className="section-panel glass">
          <div className="section-header">
            <div className="section-title">⚠️ 即将到期提醒</div>
          </div>
          <div className="reminder-list">
            {remLoading ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>加载中...</div>
            ) : reminders.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20, fontSize: 14 }}>
                ✅ 暂无到期提醒
              </div>
            ) : (
              reminders.slice(0, 5).map(r => {
                const sev = getReminderSeverity(daysRemaining(r.dueDate));
                const days = daysRemaining(r.dueDate);
                return (
                  <div key={r.id} className="reminder-item">
                    <span className={`reminder-dot ${sev}`}></span>
                    <div className="reminder-info">
                      <div className="reminder-title">{r.title}</div>
                      <div className="reminder-sub">{r.sub}</div>
                    </div>
                    <span className={`reminder-days ${sev}`}>
                      {days < 0 ? `已过期 ${Math.abs(days)} 天` : `剩余 ${days} 天`}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="section-panel glass">
          <div className="section-header">
            <div className="section-title">⚡ 快捷操作</div>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => router.push('/properties/new')}>
              <span className="icon blue">🏠</span>
              <span className="quick-action-label">添加房产</span>
            </button>
            <button className="quick-action-btn" onClick={() => router.push('/insurances/new')}>
              <span className="icon green">🛡️</span>
              <span className="quick-action-label">添加保险</span>
            </button>
            <button className="quick-action-btn" onClick={() => router.push('/properties')}>
              <span className="icon amber">📝</span>
              <span className="quick-action-label">记录税务</span>
            </button>
            <button className="quick-action-btn" onClick={() => router.push('/properties')}>
              <span className="icon purple">📋</span>
              <span className="quick-action-label">新建租约</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Properties */}
      <div className="section-panel glass">
        <div className="section-header">
          <div className="section-title">📋 最近资产</div>
          <span className="badge badge-blue" onClick={() => router.push('/properties')} style={{ cursor: 'pointer' }}>查看全部 →</span>
        </div>
        {recentList.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24, fontSize: 14 }}>
            还没有添加任何房产
          </div>
        ) : (
          <div className="content-grid-2">
            {recentList.map(p => (
              <div key={p.id} className="property-card glass-subtle" onClick={() => router.push(`/properties/${p.id}`)}>
                <div className="property-card-header">
                  <span className="property-name">{p.name}</span>
                  <span className={`badge badge-${p.status === 'rented' ? 'green' : p.status === 'vacant' ? 'red' : 'gray'}`}>
                    <span className={`status-dot ${p.status === 'rented' ? 'green' : p.status === 'vacant' ? 'red' : 'gray'}`}></span>
                    {p.status === 'rented' ? '已出租' : p.status === 'vacant' ? '空置中' : '非出租'}
                  </span>
                </div>
                <div className="property-address">📍 {p.address || '无地址'}</div>
                <div className="property-finance">
                  <div className="finance-item">
                    <div className="finance-label">估值</div>
                    <div className="finance-value">{formatRM(p.current_value, true)}</div>
                  </div>
                  <div className="finance-item">
                    <div className="finance-label">贷款余额</div>
                    <div className="finance-value">{formatRM(p.loan_balance, true)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
