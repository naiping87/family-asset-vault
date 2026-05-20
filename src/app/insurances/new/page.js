'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function NewInsurancePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;

  return (
    <>
      <div className="breadcrumb">
        <a href="#" onClick={(e) => { e.preventDefault(); router.push('/insurances'); }}>保险列表</a>
        <span>›</span>
        <span className="current">新增保险</span>
      </div>

      <div className="page-header">
        <div>
          <div className="page-title">🛡️ 新增保险</div>
          <div className="page-subtitle">添加新的保险保单</div>
        </div>
        <button className="btn btn-primary">💾 保存保单</button>
      </div>

      <div className="section-panel glass">
        <div className="section-title" style={{ marginBottom: 20 }}>📋 保单信息</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">保险类型</label>
            <input className="form-input" placeholder="例如：火险" />
          </div>
          <div className="form-group">
            <label className="form-label">保险公司</label>
            <input className="form-input" placeholder="例如：Allianz" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">保单号</label>
            <input className="form-input" placeholder="例如：FL-2026-001" />
          </div>
          <div className="form-group">
            <label className="form-label">关联房产</label>
            <input className="form-input" placeholder="选择房产 (可选)" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">保额</label>
            <div className="form-input-wrapper">
              <span className="form-prefix">RM</span>
              <input className="form-input" placeholder="500,000" style={{ paddingLeft: 52 }} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">年费</label>
            <div className="form-input-wrapper">
              <span className="form-prefix">RM</span>
              <input className="form-input" placeholder="1,200" style={{ paddingLeft: 52 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
