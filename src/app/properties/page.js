'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProperties } from '@/lib/hooks/useProperties';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PROPERTY_TYPES, getPropertyTypeLabel, getPropertyTypeIcon } from '@/lib/utils/constants';
import { formatRM } from '@/lib/utils/format';
import { CardSkeleton } from '@/components/ui/Skeleton';

const STATUS_MAP = [
  { value: 'all', label: '全部' },
  { value: 'rented', label: '已出租', color: 'green' },
  { value: 'vacant', label: '空置中', color: 'red' },
  { value: 'non_rental', label: '非出租', color: 'gray' },
];

export default function PropertiesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: properties, loading, refetch } = useProperties({ type: typeFilter, status: statusFilter });

  if (authLoading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;

  const totalValue = properties.reduce((sum, p) => sum + (p.current_value || 0), 0);
  const rentedCount = properties.filter(p => p.status === 'rented').length;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🏘️ 我的房产</div>
          <div className="page-subtitle">
            共 {properties.length} 处房产 · 总估值 {formatRM(totalValue, true)}
            {rentedCount > 0 && ` · ${rentedCount} 处已出租`}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => router.push('/properties/new')}>+ 添加房产</button>
      </div>

      {/* 类型筛选 */}
      <div className="filter-pills">
        <button className={`filter-pill ${typeFilter === 'all' ? 'active' : ''}`} onClick={() => setTypeFilter('all')}>全部类型</button>
        {PROPERTY_TYPES.map(t => (
          <button key={t.value} className={`filter-pill ${typeFilter === t.value ? 'active' : ''}`} onClick={() => setTypeFilter(t.value)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* 状态筛选 */}
      <div className="filter-pills">
        {STATUS_MAP.map(s => (
          <button key={s.value} className={`filter-pill ${statusFilter === s.value ? 'active' : ''}`} onClick={() => setStatusFilter(s.value)}>
            {s.value !== 'all' && <span className={`status-dot ${s.color}`} style={{ marginRight: 2 }}></span>}
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="content-grid-3">
          {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : properties.length === 0 ? (
        <div className="property-card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, cursor: 'default' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏠</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 12 }}>暂无房产</div>
          <button className="btn btn-primary btn-sm" onClick={() => router.push('/properties/new')}>+ 添加第一处房产</button>
        </div>
      ) : (
        <div className="content-grid-3">
          {properties.map(p => {
            const typeLabel = getPropertyTypeLabel(p.type);
            const typeIcon = getPropertyTypeIcon(p.type);
            const statusInfo = STATUS_MAP.find(s => s.value === p.status) || {};
            return (
              <div key={p.id} className="property-card glass" onClick={() => router.push(`/properties/${p.id}`)}>
                <div className="property-card-header">
                  <span className="property-name">{typeIcon} {p.name}</span>
                  <span className={`badge badge-${p.type === 'apartment' ? 'blue' : p.type === 'house' ? 'green' : p.type === 'land' ? 'amber' : 'purple'}`}>{typeLabel}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <span className={`badge badge-${statusInfo.color || 'gray'}`}>
                    <span className={`status-dot ${statusInfo.color || 'gray'}`}></span>
                    {statusInfo.label || p.status}
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
            );
          })}
        </div>
      )}
    </>
  );
}
