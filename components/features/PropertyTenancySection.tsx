"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FormInput } from "@/components/ui/FormInput";
import { FileUpload } from "@/components/ui/FileUpload";
import { showToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils/formatters";
import { addTenancyAction, editTenancyAction, deleteTenancyAction } from "@/app/dashboard/properties/[id]/tenancy-actions";
import type { Tenancy } from "@/types/database";

interface Props {
  propertyId: string;
  tenancies: Tenancy[];
}

export function PropertyTenancySection({ propertyId, tenancies }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [contractUrl, setContractUrl] = useState("");
  const [passportUrl, setPassportUrl] = useState("");

  function resetFiles() {
    setContractUrl("");
    setPassportUrl("");
  }

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const result = await addTenancyAction(propertyId, formData);
      if (result?.error) {
        showToast(result.error, "error");
      } else {
        showToast("租约已添加", "success");
        setShowForm(false);
      }
    });
  }

  function handleEdit(tenancyId: string, formData: FormData) {
    startTransition(async () => {
      const result = await editTenancyAction(propertyId, tenancyId, formData);
      if (result?.error) {
        showToast(result.error, "error");
      } else {
        showToast("租约已更新", "success");
        setEditingId(null);
      }
    });
  }

  function handleDelete(tenancyId: string) {
    startTransition(async () => {
      const result = await deleteTenancyAction(propertyId, tenancyId);
      if (result?.error) {
        showToast(result.error, "error");
      } else {
        showToast("租约已删除", "success");
      }
    });
  }

  return (
    <Card variant="intense" className="section-panel" style={{ marginTop: 24 }}>
      <div className="section-header">
        <div className="section-title">🏠 租约管理</div>
        <Button variant="secondary" size="sm" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          {showForm && !editingId ? "取消" : "+ 添加租约"}
        </Button>
      </div>
      {showForm && !editingId && (
        <form action={(fd) => { handleAdd(fd); resetFiles(); }}
          style={{ marginBottom: 20, padding: 16, background: "var(--glass-bg)", borderRadius: "var(--radius)" }}>
          <FormInput label="租户姓名" name="tenant_name" placeholder="例如：陈小明" required />
          <div className="form-row">
            <FormInput label="IC 号码" name="tenant_ic" placeholder="900101-10-1234" />
            <FormInput label="电话" name="tenant_phone" placeholder="012-345 6789" />
          </div>
          <FormInput label="邮箱" name="tenant_email" type="email" placeholder="tenant@email.com" />
          <div className="form-row">
            <FormInput label="开始日期" name="start_date" type="date" required />
            <FormInput label="结束日期" name="end_date" type="date" required />
          </div>
          <div className="form-row">
            <FormInput label="月租 (RM)" name="monthly_rent" type="number" placeholder="0.00" />
            <FormInput label="押金 (RM)" name="deposit" type="number" placeholder="0.00" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">租赁合同文件</label>
            <FileUpload
              propertyId={propertyId}
              accept=".pdf,.jpg,.jpeg,.png"
              existingFiles={contractUrl ? [{ id: "", name: "合同文件", size: 0, type: "application/pdf", url: contractUrl }] : []}
              onUploaded={setContractUrl}
              onDelete={() => setContractUrl("")}
            />
            <input type="hidden" name="contract_file_url" value={contractUrl} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">租客护照/身份证</label>
            <FileUpload
              propertyId={propertyId}
              accept=".pdf,.jpg,.jpeg,.png"
              existingFiles={passportUrl ? [{ id: "", name: "护照/身份证", size: 0, type: "application/pdf", url: passportUrl }] : []}
              onUploaded={setPassportUrl}
              onDelete={() => setPassportUrl("")}
            />
            <input type="hidden" name="tenant_passport_url" value={passportUrl} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" size="sm" type="submit" disabled={pending}>保存</Button>
          </div>
        </form>
      )}
      {tenancies.length === 0 && !showForm ? (
        <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", padding: 20 }}>暂无租约记录</p>
      ) : (
        tenancies.map((t) => (
          <Card variant="default" key={t.id} className="tenancy-card" style={{ marginBottom: 12 }}>
            {editingId === t.id ? (
              <form action={(formData: FormData) => handleEdit(t.id, formData)} style={{ padding: 4 }}>
                <FormInput label="租户姓名" name="tenant_name" defaultValue={t.tenant_name} required />
                <div className="form-row">
                  <FormInput label="IC 号码" name="tenant_ic" defaultValue={t.tenant_ic ?? ""} />
                  <FormInput label="电话" name="tenant_phone" defaultValue={t.tenant_phone ?? ""} />
                </div>
                <FormInput label="邮箱" name="tenant_email" type="email" defaultValue={t.tenant_email ?? ""} />
                <div className="form-row">
                  <FormInput label="开始日期" name="start_date" type="date" defaultValue={t.start_date} required />
                  <FormInput label="结束日期" name="end_date" type="date" defaultValue={t.end_date} required />
                </div>
                <div className="form-row">
                  <FormInput label="月租 (RM)" name="monthly_rent" type="number" defaultValue={t.monthly_rent ? String(t.monthly_rent) : ""} />
                  <FormInput label="押金 (RM)" name="deposit" type="number" defaultValue={t.deposit ? String(t.deposit) : ""} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label className="form-label">租赁合同文件</label>
                  <FileUpload
                    propertyId={propertyId}
                    accept=".pdf,.jpg,.jpeg,.png"
                    existingFiles={t.contract_file_url ? [{ id: "", name: "合同文件", size: 0, type: "application/pdf", url: t.contract_file_url }] : []}
                    onUploaded={(url) => setContractUrl(url)}
                    onDelete={() => setContractUrl("")}
                  />
                  <input type="hidden" name="contract_file_url" value={contractUrl || t.contract_file_url || ""} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label className="form-label">租客护照/身份证</label>
                  <FileUpload
                    propertyId={propertyId}
                    accept=".pdf,.jpg,.jpeg,.png"
                    existingFiles={t.tenant_passport_url ? [{ id: "", name: "护照/身份证", size: 0, type: "application/pdf", url: t.tenant_passport_url }] : []}
                    onUploaded={(url) => setPassportUrl(url)}
                    onDelete={() => setPassportUrl("")}
                  />
                  <input type="hidden" name="tenant_passport_url" value={passportUrl || t.tenant_passport_url || ""} />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <Button variant="primary" size="sm" type="submit" disabled={pending}>保存</Button>
                  <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>取消</Button>
                </div>
              </form>
            ) : (
              <>
                <div className="tenancy-header">
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 17, marginRight: 8 }}>{t.tenant_name}</span>
                    <Badge color={t.status === "active" ? "green" : "gray"}>
                      {t.status === "active" ? "活跃" : t.status === "expired" ? "已到期" : "已终止"}
                    </Badge>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button variant="secondary" size="xs" onClick={() => setEditingId(t.id)}>编辑</Button>
                    <Button variant="danger" size="xs" onClick={() => handleDelete(t.id)} disabled={pending}>删除</Button>
                  </div>
                </div>
                <div className="tenancy-body">
                  <div className="tenancy-field"><div className="tenancy-field-label">开始日期</div><div className="tenancy-field-value">{t.start_date}</div></div>
                  <div className="tenancy-field"><div className="tenancy-field-label">结束日期</div><div className="tenancy-field-value">{t.end_date}</div></div>
                  <div className="tenancy-field"><div className="tenancy-field-label">月租</div><div className="tenancy-field-value">{formatCurrency(t.monthly_rent || 0)}</div></div>
                  <div className="tenancy-field"><div className="tenancy-field-label">押金</div><div className="tenancy-field-value">{formatCurrency(t.deposit || 0)}</div></div>
                  {t.tenant_phone && <div className="tenancy-field"><div className="tenancy-field-label">电话</div><div className="tenancy-field-value">{t.tenant_phone}</div></div>}
                  {t.tenant_ic && <div className="tenancy-field"><div className="tenancy-field-label">IC 号码</div><div className="tenancy-field-value">{t.tenant_ic}</div></div>}
                </div>
              </>
            )}
          </Card>
        ))
      )}
    </Card>
  );
}
