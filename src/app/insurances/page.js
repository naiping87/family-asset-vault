'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { listInsurances } from '@/lib/api/insurances';
import { formatRM, daysRemaining } from '@/lib/utils/format';

const TYPE_ICONS = { fire: '🔥', flood: '🌊', home: '🏠', mlta: '📋', mrta: '📋', other: '📄' };

export default function InsurancesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listInsurances();
      setInsurances(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (authLoading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;

  const totalSumInsured = insurances.reduce((sum, i) => sum + (i.sum_insured || 0), 0);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🛡️ 我的保险</div>
          <div className="page-subtitle">
            共 {insurances.length} 份保单
            {totalSumInsured > 0 && ` · 总保额 ${formatRM(totalSumInsured, true)}`}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => router.push('/insurances/new')}>+ 添加保险</button>
      </div>

      {loading ? (
        <div className="content-grid-3">
          {[1, 2, 3].map(i => <div key={i} className="property-card glass" style={{ minHeight: 200 }}><div className="skeleton" style={{ height: '100%' }} /></div>)}
        </div>
      ) : insurances.length === 0 ? (
        <div className="property-card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, cursor: 'default' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🛡️</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 12 }}>暂无保单</div>
          <button className="btn btn-primary btn-sm" onClick={() => router.push('/insurances/new')}>+ 添加第一份保险</button>
        </div>
      ) : (
        <div className="content-grid-3">
          {insurances.map(ins => {
            const days = daysRemaining(ins.end_date);
            const expired = days < 0;
            return (
              <div key={ins.id} className="property-card glass">
                <div style={{ fontSize: 28, marginBottom: 8 }}>{TYPE_ICONS[ins.type] || '📄'}</div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{ins.type === 'fire' ? '火险' : ins.type === 'flood' ? '水灾险' : ins.type === 'home' ? '房屋保险' : ins.type === 'mlta' ? 'MLTA' : ins.type === 'mrta' ? 'MRTA' : '保险'}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{ins.properties?.name || '未关联房产'}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{ins.company} · {ins.policy_no}</div>
                <div className="property-finance" style={{ marginBottom: 8 }}>
                  <div className="finance-item">
                    <div className="finance-label">保额</div>
                    <div className="finance-value" style={{ fontSize: 16 }}>{formatRM(ins.sum_insured, true)}</div>
                  </div>
                  <div className="finance-item">
                    <div className="finance-label">年费</div>
                    <div className="finance-value" style={{ fontSize: 16 }}>{formatRM(ins.annual_premium)}</div>
                  </div>
                </div>
                <span className={`badge ${expired ? 'badge-red' : days <= 30 ? 'badge-amber' : 'badge-green'}`}>
                  {expired ? `已过期 ${Math.abs(days)} 天！` : `有效期至 ${ins.end_date} · ${days} 天`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
