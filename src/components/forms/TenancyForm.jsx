'use client';
import { useState } from 'react';
import { addTenancy, updateTenancy, removeTenancy } from '@/lib/api/tenancies';

const INITIAL = {
  tenant_name: '',
  tenant_ic: '',
  tenant_phone: '',
  tenant_email: '',
  start_date: '',
  end_date: '',
  monthly_rent: '',
  deposit: '',
};

export default function TenancyForm({ propertyId, tenancies, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tenant_name || !form.start_date || !form.end_date || !form.monthly_rent) return;
    setSaving(true);
    try {
      await addTenancy({
        property_id: propertyId,
        tenant_name: form.tenant_name,
        tenant_ic: form.tenant_ic || null,
        tenant_phone: form.tenant_phone || null,
        tenant_email: form.tenant_email || null,
        start_date: form.start_date,
        end_date: form.end_date,
        monthly_rent: parseFloat(form.monthly_rent),
        deposit: form.deposit ? parseFloat(form.deposit) : null,
      });
      setForm(INITIAL);
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert('添加失败: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('确定删除此租约？')) return;
    try {
      await removeTenancy(id);
      onRefresh();
    } catch (err) {
      alert('删除失败: ' + err.message);
    }
  };

  const isActive = (endDate) => new Date(endDate) >= new Date();

  return (
    <div className="section-panel glass" style={{ marginBottom: 16 }}>
      <div className="section-header">
        <div className="section-title">📋 租约记录</div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '+ 添加租约'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 20, background: 'var(--glass-bg)', borderRadius: 'var(--radius)' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">租客姓名 *</label>
              <input className="form-input" required placeholder="例如：陈小明" value={form.tenant_name} onChange={set('tenant_name')} />
            </div>
            <div className="form-group">
              <label className="form-label">IC 号码</label>
              <input className="form-input" placeholder="例如：900101-14-1234" value={form.tenant_ic} onChange={set('tenant_ic')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">电话</label>
              <input className="form-input" placeholder="例如：012-345 6789" value={form.tenant_phone} onChange={set('tenant_phone')} />
            </div>
            <div className="form-group">
              <label className="form-label">邮箱</label>
              <input className="form-input" placeholder="tenant@email.com" value={form.tenant_email} onChange={set('tenant_email')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">租期开始 *</label>
              <input className="form-input" type="date" required value={form.start_date} onChange={set('start_date')} />
            </div>
            <div className="form-group">
              <label className="form-label">租期结束 *</label>
              <input className="form-input" type="date" required value={form.end_date} onChange={set('end_date')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">月租 *</label>
              <div className="form-input-wrapper">
                <span className="form-prefix">RM</span>
                <input className="form-input" required placeholder="2,200" style={{ paddingLeft: 52 }} value={form.monthly_rent} onChange={e => setForm(prev => ({ ...prev, monthly_rent: e.target.value.replace(/[^0-9.]/g, '') }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">押金</label>
              <div className="form-input-wrapper">
                <span className="form-prefix">RM</span>
                <input className="form-input" placeholder="4,400" style={{ paddingLeft: 52 }} value={form.deposit} onChange={e => setForm(prev => ({ ...prev, deposit: e.target.value.replace(/[^0-9.]/g, '') }))} />
              </div>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" type="submit" disabled={saving} style={{ marginTop: 8 }}>
            {saving ? '保存中...' : '💾 保存租约'}
          </button>
        </form>
      )}

      {tenancies.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 16, fontSize: 14 }}>
          暂无租约记录
        </div>
      )}

      {tenancies.map(t => (
        <div key={t.id} className="tenancy-card glass-subtle">
          <div className="tenancy-header">
            <span style={{ fontWeight: 700, fontSize: 16 }}>📋 {t.tenant_name}</span>
            <span className={`badge ${isActive(t.end_date) ? 'badge-green' : 'badge-gray'}`}>
              <span className={`status-dot ${isActive(t.end_date) ? 'green' : 'gray'}`}></span>
              {isActive(t.end_date) ? '生效中' : '已结束'}
            </span>
          </div>
          <div className="tenancy-body">
            <div className="tenancy-field">
              <div className="tenancy-field-label">租客</div>
              <div className="tenancy-field-value">{t.tenant_name}</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">IC 号码</div>
              <div className="tenancy-field-value">{t.tenant_ic || '—'}</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">电话</div>
              <div className="tenancy-field-value">{t.tenant_phone || '—'}</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">邮箱</div>
              <div className="tenancy-field-value">{t.tenant_email || '—'}</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">租期</div>
              <div className="tenancy-field-value">{t.start_date} ~ {t.end_date}</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">月租 / 押金</div>
              <div className="tenancy-field-value">RM {t.monthly_rent?.toLocaleString()} / RM {t.deposit?.toLocaleString() || 0}</div>
            </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--glass-border)' }}>
            <button className="btn btn-secondary btn-xs" onClick={() => handleRemove(t.id)}>🗑️ 删除</button>
          </div>
        </div>
      ))}
    </div>
  );
}
