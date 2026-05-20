'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';

export default function EditPropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;

  return (
    <>
      <div className="breadcrumb">
        <a href="#" onClick={(e) => { e.preventDefault(); router.push('/properties'); }}>房产列表</a>
        <span>›</span>
        <a href="#" onClick={(e) => { e.preventDefault(); router.push(`/properties/${params.id}`); }}>房产详情</a>
        <span>›</span>
        <span className="current">编辑房产</span>
      </div>
      <div className="page-header">
        <div>
          <div className="page-title">✏️ 编辑房产</div>
          <div className="page-subtitle">修改房产信息</div>
        </div>
        <button className="btn btn-primary">💾 保存修改</button>
      </div>
      <div className="section-panel glass">
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>
          编辑功能将在 Phase 2 中实现
        </div>
      </div>
    </>
  );
}
