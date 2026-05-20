'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createProperty } from '@/lib/api/properties';
import PropertyForm from '@/components/forms/PropertyForm';

export default function NewPropertyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  if (authLoading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      const created = await createProperty({ ...payload, user_id: user.id });
      router.push(`/properties/${created.id}`);
    } catch (err) {
      alert('保存失败: ' + err.message);
      setSaving(false);
    }
  };

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
      </div>

      <PropertyForm onSave={handleSave} saving={saving} />
    </>
  );
}
