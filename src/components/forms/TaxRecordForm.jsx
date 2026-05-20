'use client';
import { useState } from 'react';
import { addTaxRecord, markTaxPaid, removeTaxRecord } from '@/lib/api/tax-records';
import { TAX_TYPES } from '@/lib/utils/constants';

const INITIAL = { tax_type: 'cukai_pintu', council: '', account_no: '', amount: '', due_date: '' };

export default function TaxRecordForm({ propertyId, records, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.due_date) return;
    setSaving(true);
    try {
      await addTaxRecord({
        property_id: propertyId,
        tax_type: form.tax_type,
        council: form.council || null,
        account_no: form.account_no || null,
        amount: parseFloat(form.amount),
        due_date: form.due_date,
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

  const handleMarkPaid = async (id) => {
    try {
      await markTaxPaid(id);
      onRefresh();
    } catch (err) {
      alert('操作失败: ' + err.message);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('确定删除此记录？')) return;
    try {
      await removeTaxRecord(id);
      onRefresh();
    } catch (err) {
      alert('删除失败: ' + err.message);
    }
  };

  return (
    <div className="section-panel glass">
      <div className="section-header">
        <div className="section-title">🧾 税务记录</div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '+ 添加税务'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 20, background: 'var(--glass-bg)', borderRadius: 'var(--radius)' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">类型</label>
              <select className="form-input" value={form.tax_type} onChange={set('tax_type')}>
                {TAX_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Majlis</label>
              <input className="form-input" placeholder="例如：DBKL" value={form.council} onChange={set('council')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Account No.</label>
              <input className="form-input" placeholder="例如：ACC-2020-00123" value={form.account_no} onChange={set('account_no')} />
            </div>
            <div className="form-group">
              <label className="form-label">截止日期 *</label>
              <input className="form-input" type="date" required value={form.due_date} onChange={set('due_date')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">金额 *</label>
              <div className="form-input-wrapper">
                <span className="form-prefix">RM</span>
                <input className="form-input" required placeholder="1,200" style={{ paddingLeft: 52 }} value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value.replace(/[^0-9.]/g, '') }))} />
              </div>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn btn-primary btn-sm" type="submit" disabled={saving} style={{ height: 44 }}>
                {saving ? '保存中...' : '💾 保存'}
              </button>
            </div>
          </div>
        </form>
      )}

      {records.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 16, fontSize: 14 }}>
          暂无税务记录
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>类型</th>
              <th>Majlis</th>
              <th>Account No.</th>
              <th>金额</th>
              <th>截止日期</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id}>
                <td>{TAX_TYPES.find(t => t.value === r.tax_type)?.icon} {TAX_TYPES.find(t => t.value === r.tax_type)?.label}</td>
                <td>{r.council || '—'}</td>
                <td>{r.account_no || '—'}</td>
                <td style={{ fontWeight: 600 }}>RM {r.amount?.toLocaleString()}</td>
                <td>{r.due_date}</td>
                <td>
                  <span className={`badge ${r.paid ? 'badge-green' : 'badge-red'}`}>
                    {r.paid ? '已缴' : '未缴'}
                  </span>
                </td>
                <td>
                  {!r.paid && (
                    <button className="btn btn-xs" style={{ background: 'var(--success-bg)', color: 'var(--success)', marginRight: 6 }} onClick={() => handleMarkPaid(r.id)}>
                      ✓ 标记已缴
                    </button>
                  )}
                  <button className="btn btn-secondary btn-xs" onClick={() => handleRemove(r.id)}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
