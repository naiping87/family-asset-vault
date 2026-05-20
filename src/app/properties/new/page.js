'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function NewPropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;

  return (
    <>
      <div className="breadcrumb">
        <a href="#" onClick={(e) => { e.preventDefault(); router.push('/properties'); }}>房产列表</a>
        <span>›</span>
        <span className="current">新增房产</span>
      </div>

      <div className="page-header">
        <div>
          <div className="page-title">🏠 新增房产</div>
          <div className="page-subtitle">填写房产信息，支持地图定位选点</div>
        </div>
        <button className="btn btn-primary">💾 保存房产</button>
      </div>

      <div className="section-panel glass" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 20 }}>📋 基本信息</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">房产名称 *</label>
            <input className="form-input" placeholder="例如：SkyVue 高级公寓" />
          </div>
          <div className="form-group">
            <label className="form-label">房产类型 *</label>
            <input className="form-input" placeholder="选择类型" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">地址</label>
          <input className="form-input" placeholder="完整地址" />
        </div>
      </div>

      <div className="section-panel glass" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 20 }}>📍 地图定位</div>
        <div className="map-placeholder">
          <div className="icon">🗺️</div>
          <div>Google Maps 选点功能即将上线</div>
          <div style={{ fontSize: 12 }}>暂时可以手动输入地址</div>
        </div>
      </div>

      <div className="section-panel glass" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 20 }}>💰 财务信息</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">买入价格</label>
            <div className="form-input-wrapper">
              <span className="form-prefix">RM</span>
              <input className="form-input" placeholder="650,000" style={{ paddingLeft: 52 }} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">当前估值</label>
            <div className="form-input-wrapper">
              <span className="form-prefix">RM</span>
              <input className="form-input" placeholder="850,000" style={{ paddingLeft: 52 }} />
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">贷款余额</label>
            <div className="form-input-wrapper">
              <span className="form-prefix">RM</span>
              <input className="form-input" placeholder="420,000" style={{ paddingLeft: 52 }} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">贷款银行</label>
            <input className="form-input" placeholder="例如：Maybank" />
          </div>
        </div>
      </div>
    </>
  );
}
