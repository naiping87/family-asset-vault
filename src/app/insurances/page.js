'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function InsurancesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🛡️ 我的保险</div>
          <div className="page-subtitle">共 0 份保单</div>
        </div>
        <button className="btn btn-primary" onClick={() => router.push('/insurances/new')}>+ 添加保险</button>
      </div>

      <div className="content-grid-3">
        <div className="property-card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, cursor: 'default' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🛡️</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 12 }}>暂无保单</div>
          <button className="btn btn-primary btn-sm" onClick={() => router.push('/insurances/new')}>+ 添加第一份保险</button>
        </div>
      </div>
    </>
  );
}
