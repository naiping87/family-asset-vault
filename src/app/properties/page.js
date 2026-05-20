'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { PROPERTY_TYPES } from '@/lib/utils/constants';
import { useState } from 'react';

export default function PropertiesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🏘️ 我的房产</div>
          <div className="page-subtitle">共 0 处房产</div>
        </div>
        <button className="btn btn-primary" onClick={() => router.push('/properties/new')}>+ 添加房产</button>
      </div>

      <div className="filter-pills">
        <button className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>全部</button>
        {PROPERTY_TYPES.map(t => (
          <button
            key={t.value}
            className={`filter-pill ${activeFilter === t.value ? 'active' : ''}`}
            onClick={() => setActiveFilter(t.value)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="content-grid-3">
        <div className="property-card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, cursor: 'default' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏠</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 12 }}>暂无房产</div>
          <button className="btn btn-primary btn-sm" onClick={() => router.push('/properties/new')}>+ 添加第一处房产</button>
        </div>
      </div>
    </>
  );
}
