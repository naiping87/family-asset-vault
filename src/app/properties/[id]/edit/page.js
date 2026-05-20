'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getProperty, updateProperty, deleteProperty } from '@/lib/api/properties';
import PropertyForm from '@/components/forms/PropertyForm';

export default function EditPropertyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    getProperty(params.id).then(data => {
      setInitialData(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.id]);

  if (authLoading || loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;
  if (!initialData) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>房产未找到</div>;

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      await updateProperty(params.id, payload);
      router.push(`/properties/${params.id}`);
    } catch (err) {
      alert('保存失败: ' + err.message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定删除此房产？此操作不可撤销。')) return;
    try {
      await deleteProperty(params.id);
      router.push('/properties');
    } catch (err) {
      alert('删除失败: ' + err.message);
    }
  };

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
          <div className="page-subtitle">修改 {initialData.name} 的信息</div>
        </div>
        <button className="btn btn-danger" onClick={handleDelete}>🗑️ 删除房产</button>
      </div>

      <PropertyForm initialData={initialData} onSave={handleSave} saving={saving} />
    </>
  );
}
