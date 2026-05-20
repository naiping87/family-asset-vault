'use client';
import { useState } from 'react';
import { addCoOwner, removeCoOwner } from '@/lib/api/co-owners';

export default function CoOwnerForm({ propertyId, owners, onRefresh }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ownershipPct, setOwnershipPct] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      await addCoOwner({
        property_id: propertyId,
        name: name.trim(),
        email: email.trim() || null,
        ownership_pct: ownershipPct ? parseFloat(ownershipPct) : null,
      });
      setName('');
      setEmail('');
      setOwnershipPct('');
      onRefresh();
    } catch (err) {
      alert('添加失败: ' + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('确定移除此联名业主？')) return;
    try {
      await removeCoOwner(id);
      onRefresh();
    } catch (err) {
      alert('移除失败: ' + err.message);
    }
  };

  const colors = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#ec4899,#f43f5e)',
    'linear-gradient(135deg,#059669,#34d399)',
    'linear-gradient(135deg,#d97706,#fbbf24)',
  ];

  return (
    <div className="section-panel glass" style={{ marginBottom: 20 }}>
      <div className="section-header">
        <div className="section-title">👥 联名业主</div>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>共 {owners.length} 人</span>
      </div>

      {owners.map((owner, i) => (
        <div key={owner.id} className="owner-item">
          <div className="owner-avatar" style={{ background: colors[i % colors.length] }}>
            {owner.name.charAt(0)}
          </div>
          <div className="owner-info">
            <div className="owner-name">{owner.name}{owner.role === 'primary' ? ' (主业主)' : ''}</div>
            <div className="owner-role">{owner.email || ''}</div>
          </div>
          <div className="owner-pct">{owner.ownership_pct || '—'}%</div>
          {owner.role !== 'primary' && (
            <button className="owner-remove" onClick={() => handleRemove(owner.id)}>✕</button>
          )}
        </div>
      ))}

      <form onSubmit={handleAdd} style={{ marginTop: 16 }}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">姓名 *</label>
            <input className="form-input" placeholder="业主姓名" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">邮箱</label>
            <input className="form-input" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">持有比例 (%)</label>
            <input className="form-input" placeholder="50" value={ownershipPct} onChange={e => setOwnershipPct(e.target.value.replace(/[^0-9.]/g, ''))} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-secondary btn-sm" type="submit" disabled={adding} style={{ height: 44 }}>
              {adding ? '添加中...' : '+ 添加联名业主'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
