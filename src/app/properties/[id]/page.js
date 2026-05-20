'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

const TABS = [
  { key: 'overview', label: '📋 概览' },
  { key: 'tenancy', label: '🔑 出租' },
  { key: 'tax', label: '🧾 税务' },
  { key: 'insurance', label: '🛡️ 保险' },
  { key: 'files', label: '📁 文件' },
];

export default function PropertyDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;

  const propertyId = params.id;

  return (
    <>
      <div className="breadcrumb">
        <a href="#" onClick={(e) => { e.preventDefault(); router.push('/properties'); }}>房产列表</a>
        <span>›</span>
        <span className="current">房产详情</span>
      </div>

      <div className="detail-header glass">
        <div className="detail-title-area">
          <div className="detail-meta">
            <span className="badge badge-blue">🏢 公寓</span>
          </div>
          <div className="detail-title">房产加载中...</div>
          <div className="detail-address">📍 正在加载...</div>
        </div>
        <div className="detail-actions">
          <button className="btn btn-secondary" onClick={() => router.push(`/properties/${propertyId}/edit`)}>✏️ 编辑</button>
          <button className="btn btn-danger">🗑️ 删除</button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="section-panel glass">
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>
          房产详情将在 Phase 2 中实现
        </div>
      </div>
    </>
  );
}
