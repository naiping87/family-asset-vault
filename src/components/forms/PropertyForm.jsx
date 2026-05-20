'use client';
import { useState } from 'react';
import { PROPERTY_TYPES } from '@/lib/utils/constants';

const INITIAL = {
  name: '',
  type: 'apartment',
  address: '',
  latitude: '',
  longitude: '',
  purchase_price: '',
  current_value: '',
  loan_balance: '',
  loan_bank: '',
  title_deed_no: '',
  notes: '',
};

export default function PropertyForm({ initialData, onSave, saving }) {
  const [form, setForm] = useState({ ...INITIAL, ...initialData });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const setNum = (field) => (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      purchase_price: form.purchase_price ? parseFloat(form.purchase_price) : null,
      current_value: form.current_value ? parseFloat(form.current_value) : null,
      loan_balance: form.loan_balance ? parseFloat(form.loan_balance) : null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
    };
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 基本信息 */}
      <div className="section-panel glass" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 20 }}>📋 基本信息</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">房产名称 *</label>
            <input className="form-input" required placeholder="例如：SkyVue 高级公寓" value={form.name} onChange={set('name')} />
          </div>
          <div className="form-group">
            <label className="form-label">房产类型 *</label>
            <select className="form-input" value={form.type} onChange={set('type')} required>
              {PROPERTY_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">地址</label>
          <input className="form-input" placeholder="完整地址" value={form.address} onChange={set('address')} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">纬度</label>
            <input className="form-input" placeholder="例如：3.1390" value={form.latitude} onChange={set('latitude')} />
          </div>
          <div className="form-group">
            <label className="form-label">经度</label>
            <input className="form-input" placeholder="例如：101.6869" value={form.longitude} onChange={set('longitude')} />
          </div>
        </div>
      </div>

      {/* 地图定位 */}
      <div className="section-panel glass" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 20 }}>📍 地图定位</div>
        <div className="map-placeholder">
          <div className="icon">🗺️</div>
          <div>{form.latitude && form.longitude ? `坐标: ${form.latitude}, ${form.longitude}` : 'Google Maps 选点'}</div>
          <div style={{ fontSize: 12 }}>输入坐标后显示地图</div>
        </div>
      </div>

      {/* 财务信息 */}
      <div className="section-panel glass" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 20 }}>💰 财务信息</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">买入价格</label>
            <div className="form-input-wrapper">
              <span className="form-prefix">RM</span>
              <input className="form-input" placeholder="650,000" style={{ paddingLeft: 52 }} value={form.purchase_price} onChange={setNum('purchase_price')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">当前估值</label>
            <div className="form-input-wrapper">
              <span className="form-prefix">RM</span>
              <input className="form-input" placeholder="850,000" style={{ paddingLeft: 52 }} value={form.current_value} onChange={setNum('current_value')} />
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">贷款余额</label>
            <div className="form-input-wrapper">
              <span className="form-prefix">RM</span>
              <input className="form-input" placeholder="420,000" style={{ paddingLeft: 52 }} value={form.loan_balance} onChange={setNum('loan_balance')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">贷款银行</label>
            <input className="form-input" placeholder="例如：Maybank" value={form.loan_bank} onChange={set('loan_bank')} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">地契编号</label>
          <input className="form-input" placeholder="例如：HS(D) 12345/2020" value={form.title_deed_no} onChange={set('title_deed_no')} />
        </div>
        <div className="form-group">
          <label className="form-label">备注</label>
          <textarea className="form-input" placeholder="其他备注信息..." rows={3} value={form.notes} onChange={set('notes')} />
        </div>
      </div>

      <button className="btn btn-primary" type="submit" disabled={saving} style={{ width: '100%' }}>
        {saving ? '保存中...' : '💾 保存房产'}
      </button>
    </form>
  );
}
