'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { createInsurance } from '@/lib/api/insurances';
import { listProperties } from '@/lib/api/properties';
import { INSURANCE_TYPES } from '@/lib/utils/constants';

const INITIAL = { type: 'fire', company: '', policy_no: '', property_id: '', sum_insured: '', annual_premium: '', start_date: '', end_date: '' };

export default function NewInsurancePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    listProperties().then(setProperties).catch(() => {});
  }, []);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const setNum = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value.replace(/[^0-9.]/g, '') }));

  if (authLoading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.policy_no || !form.sum_insured || !form.annual_premium || !form.start_date || !form.end_date) return;
    setSaving(true);
    try {
      const created = await createInsurance({
        user_id: user.id,
        type: form.type,
        company: form.company,
        policy_no: form.policy_no,
        property_id: form.property_id || null,
        sum_insured: parseFloat(form.sum_insured),
        annual_premium: parseFloat(form.annual_premium),
        start_date: form.start_date,
        end_date: form.end_date,
      });
      router.push('/insurances');
    } catch (err) {
      alert('保存失败: ' + err.message);
      setSaving(false);
    }
  };

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
      </div>

      <form onSubmit={handleSubmit}>
        <div className="section-panel glass" style={{ marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>📋 保单信息</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">保险类型 *</label>
              <select className="form-input" value={form.type} onChange={set('type')} required>
                {INSURANCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">保险公司 *</label>
              <input className="form-input" required placeholder="例如：Allianz" value={form.company} onChange={set('company')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">保单号 *</label>
              <input className="form-input" required placeholder="例如：FL-2026-001" value={form.policy_no} onChange={set('policy_no')} />
            </div>
            <div className="form-group">
              <label className="form-label">关联房产</label>
              <select className="form-input" value={form.property_id} onChange={set('property_id')}>
                <option value="">不关联</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">保额 *</label>
              <div className="form-input-wrapper">
                <span className="form-prefix">RM</span>
                <input className="form-input" required placeholder="500,000" style={{ paddingLeft: 52 }} value={form.sum_insured} onChange={setNum('sum_insured')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">年费 *</label>
              <div className="form-input-wrapper">
                <span className="form-prefix">RM</span>
                <input className="form-input" required placeholder="1,200" style={{ paddingLeft: 52 }} value={form.annual_premium} onChange={setNum('annual_premium')} />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">生效日期 *</label>
              <input className="form-input" type="date" required value={form.start_date} onChange={set('start_date')} />
            </div>
            <div className="form-group">
              <label className="form-label">到期日期 *</label>
              <input className="form-input" type="date" required value={form.end_date} onChange={set('end_date')} />
            </div>
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving} style={{ width: '100%' }}>
          {saving ? '保存中...' : '💾 保存保单'}
        </button>
      </form>
    </>
  );
}
