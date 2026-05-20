'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { getProperty } from '@/lib/api/properties';
import { listCoOwners } from '@/lib/api/co-owners';
import { listTenancies } from '@/lib/api/tenancies';
import { listTaxRecords } from '@/lib/api/tax-records';
import { listInsurances } from '@/lib/api/insurances';
import { formatRM, formatDate } from '@/lib/utils/format';
import { getPropertyTypeLabel, getPropertyTypeIcon } from '@/lib/utils/constants';
import CoOwnerForm from '@/components/forms/CoOwnerForm';
import TenancyForm from '@/components/forms/TenancyForm';
import TaxRecordForm from '@/components/forms/TaxRecordForm';
import MapPlaceholder from '@/components/ui/MapPlaceholder';

const TABS = [
  { key: 'overview', label: '📋 概览' },
  { key: 'tenancy', label: '🔑 出租' },
  { key: 'tax', label: '🧾 税务' },
  { key: 'insurance', label: '🛡️ 保险' },
  { key: 'files', label: '📁 文件' },
];

export default function PropertyDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const [property, setProperty] = useState(null);
  const [coOwners, setCoOwners] = useState([]);
  const [tenancies, setTenancies] = useState([]);
  const [taxRecords, setTaxRecords] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);

  const propertyId = params.id;

  const loadData = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const [p, co, t, tx, ins] = await Promise.all([
        getProperty(propertyId),
        listCoOwners(propertyId),
        listTenancies(propertyId),
        listTaxRecords(propertyId),
        listInsurances({ propertyId }),
      ]);
      setProperty(p);
      setCoOwners(co);
      setTenancies(t);
      setTaxRecords(tx);
      setInsurances(ins);
    } catch (err) {
      console.error('加载失败:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => { loadData(); }, [loadData]);

  if (authLoading || loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>请先登录</div>;
  if (!property) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>房产不存在</div>;

  const typeLabel = getPropertyTypeLabel(property.type);
  const typeIcon = getPropertyTypeIcon(property.type);

  return (
    <>
      <div className="breadcrumb">
        <a href="#" onClick={(e) => { e.preventDefault(); router.push('/properties'); }}>房产列表</a>
        <span>›</span>
        <span className="current">{property.name}</span>
      </div>

      {/* Detail Header */}
      <div className="detail-header glass">
        <div className="detail-title-area">
          <div className="detail-meta">
            <span className={`badge badge-${property.type === 'apartment' ? 'blue' : property.type === 'house' ? 'green' : property.type === 'land' ? 'amber' : 'purple'}`}>
              {typeIcon} {typeLabel}
            </span>
            {property.status === 'rented' && <span className="badge badge-green"><span className="status-dot green"></span> 已出租</span>}
            {property.status === 'vacant' && <span className="badge badge-red"><span className="status-dot red"></span> 空置中</span>}
            {property.status === 'non_rental' && <span className="badge badge-gray"><span className="status-dot gray"></span> 非出租</span>}
          </div>
          <div className="detail-title">{property.name}</div>
          <div className="detail-address">📍 {property.address || '无地址'}</div>
          <div className="detail-stats">
            <div className="detail-stat">
              <div className="detail-stat-label">估值</div>
              <div className="detail-stat-value">{formatRM(property.current_value, true)}</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">贷款余额</div>
              <div className="detail-stat-value">{formatRM(property.loan_balance, true)}</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">地契编号</div>
              <div className="detail-stat-value">{property.title_deed_no || '—'}</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">贷款银行</div>
              <div className="detail-stat-value">{property.loan_bank || '—'}</div>
            </div>
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn btn-secondary" onClick={() => router.push(`/properties/${propertyId}/edit`)}>✏️ 编辑</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(tab => (
          <button key={tab.key} className={`tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="content-grid-2">
          <div className="section-panel glass">
            <div className="section-title" style={{ marginBottom: 16 }}>📍 位置</div>
            <MapPlaceholder latitude={property.latitude} longitude={property.longitude} />
          </div>
          <div>
            <CoOwnerForm propertyId={propertyId} owners={coOwners} onRefresh={loadData} />
            {property.notes && (
              <div className="section-panel glass">
                <div className="section-title" style={{ marginBottom: 8 }}>📝 备注</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{property.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Tenancy */}
      {activeTab === 'tenancy' && (
        <TenancyForm propertyId={propertyId} tenancies={tenancies} onRefresh={loadData} />
      )}

      {/* Tab: Tax */}
      {activeTab === 'tax' && (
        <TaxRecordForm propertyId={propertyId} records={taxRecords} onRefresh={loadData} />
      )}

      {/* Tab: Insurance */}
      {activeTab === 'insurance' && (
        <div className="section-panel glass">
          <div className="section-header">
            <div className="section-title">🛡️ 关联保险</div>
            <button className="btn btn-primary btn-sm" onClick={() => router.push('/insurances/new')}>+ 添加保险</button>
          </div>
          {insurances.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24, fontSize: 14 }}>
              暂无关联保险
            </div>
          ) : (
            <div className="content-grid-2" style={{ marginBottom: 0 }}>
              {insurances.map(ins => (
                <div key={ins.id} className="tenancy-card glass-subtle">
                  <div className="tenancy-header">
                    <span style={{ fontWeight: 700 }}>{ins.type === 'fire' ? '🔥 火险' : ins.type === 'flood' ? '🌊 水灾险' : '🛡️ 保险'}</span>
                    <span className={`badge ${new Date(ins.end_date) >= new Date() ? 'badge-green' : 'badge-red'}`}>{
                      new Date(ins.end_date) >= new Date() ? '有效' : '已过期'
                    }</span>
                  </div>
                  <div className="tenancy-body">
                    <div className="tenancy-field">
                      <div className="tenancy-field-label">保险公司</div>
                      <div className="tenancy-field-value">{ins.company}</div>
                    </div>
                    <div className="tenancy-field">
                      <div className="tenancy-field-label">保单号</div>
                      <div className="tenancy-field-value">{ins.policy_no}</div>
                    </div>
                    <div className="tenancy-field">
                      <div className="tenancy-field-label">保额</div>
                      <div className="tenancy-field-value">{formatRM(ins.sum_insured)}</div>
                    </div>
                    <div className="tenancy-field">
                      <div className="tenancy-field-label">年费</div>
                      <div className="tenancy-field-value">{formatRM(ins.annual_premium)}</div>
                    </div>
                    <div className="tenancy-field">
                      <div className="tenancy-field-label">有效期</div>
                      <div className="tenancy-field-value">至 {ins.end_date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Files */}
      {activeTab === 'files' && (
        <div className="section-panel glass">
          <div className="section-title" style={{ marginBottom: 20 }}>📁 文件上传</div>
          <div className="upload-zone">
            <div className="upload-icon">📤</div>
            <div className="upload-text">文件上传功能即将上线</div>
            <div className="upload-hint">支持 PDF、JPG、PNG · 最大 10MB</div>
          </div>
        </div>
      )}
    </>
  );
}
