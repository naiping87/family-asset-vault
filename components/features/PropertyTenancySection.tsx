"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [contractUrl, setContractUrl] = useState("");
  const [passportUrl, setPassportUrl] = useState("");

  function resetFiles() { setContractUrl(""); setPassportUrl(""); }

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const result = await addTenancyAction(propertyId, formData);
      if (result?.error) { showToast(result.error, "error"); }
      else { showToast(t("tenancy.added"), "success"); setShowForm(false); }
    });
  }

  function handleEdit(tenancyId: string, formData: FormData) {
    startTransition(async () => {
      const result = await editTenancyAction(propertyId, tenancyId, formData);
      if (result?.error) { showToast(result.error, "error"); }
      else { showToast(t("tenancy.updated"), "success"); setEditingId(null); }
    });
  }

  function handleDelete(tenancyId: string) {
    startTransition(async () => {
      const result = await deleteTenancyAction(propertyId, tenancyId);
      if (result?.error) { showToast(result.error, "error"); }
      else { showToast(t("tenancy.deleted"), "success"); }
    });
  }

  function statusLabel(s: string) {
    if (s === "active") return t("tenancy.active");
    if (s === "expired") return t("tenancy.expired");
    return t("tenancy.terminated");
  }

  return (
    <Card variant="intense" className="section-panel" style={{ marginTop: 24 }}>
      <div className="section-header">
        <div className="section-title">🏠 {t("tenancy.title")}</div>
        <Button variant="secondary" size="sm" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          {showForm && !editingId ? t("common.cancel") : `+ ${t("tenancy.addTenancy")}`}
        </Button>
      </div>
      {showForm && !editingId && (
        <form action={(fd) => { handleAdd(fd); resetFiles(); }}
          style={{ marginBottom: 20, padding: 16, background: "var(--glass-bg)", borderRadius: "var(--radius)" }}>
          <FormInput label={t("tenancy.tenantName")} name="tenant_name" placeholder={t("tenancy.tenantNamePlaceholder")} required />
          <div className="form-row">
            <FormInput label={t("tenancy.tenantIC")} name="tenant_ic" placeholder={t("tenancy.tenantICPlaceholder")} />
            <FormInput label={t("tenancy.tenantPhone")} name="tenant_phone" placeholder={t("tenancy.tenantPhonePlaceholder")} />
          </div>
          <FormInput label={t("tenancy.tenantEmail")} name="tenant_email" type="email" placeholder={t("tenancy.tenantEmailPlaceholder")} />
          <div className="form-row">
            <FormInput label={t("tenancy.startDate")} name="start_date" type="date" required />
            <FormInput label={t("tenancy.endDate")} name="end_date" type="date" required />
          </div>
          <div className="form-row">
            <FormInput label={`${t("tenancy.monthlyRent")} (RM)`} name="monthly_rent" type="number" placeholder="0.00" />
            <FormInput label={`${t("tenancy.deposit")} (RM)`} name="deposit" type="number" placeholder="0.00" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">{t("tenancy.contractFile")}</label>
            <FileUpload propertyId={propertyId} accept=".pdf,.jpg,.jpeg,.png"
              existingFiles={contractUrl ? [{ id: "", name: "contract", size: 0, type: "application/pdf", url: contractUrl }] : []}
              onUploaded={setContractUrl} onDelete={() => setContractUrl("")} />
            <input type="hidden" name="contract_file_url" value={contractUrl} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">{t("tenancy.passportFile")}</label>
            <FileUpload propertyId={propertyId} accept=".pdf,.jpg,.jpeg,.png"
              existingFiles={passportUrl ? [{ id: "", name: "passport", size: 0, type: "application/pdf", url: passportUrl }] : []}
              onUploaded={setPassportUrl} onDelete={() => setPassportUrl("")} />
            <input type="hidden" name="tenant_passport_url" value={passportUrl} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" size="sm" type="submit" disabled={pending}>{t("common.save")}</Button>
          </div>
        </form>
      )}
      {tenancies.length === 0 && !showForm ? (
        <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", padding: 20 }}>{t("property.noTenancies")}</p>
      ) : (
        tenancies.map((tItem) => (
          <Card variant="default" key={tItem.id} className="tenancy-card" style={{ marginBottom: 12 }}>
            {editingId === tItem.id ? (
              <form action={(formData: FormData) => handleEdit(tItem.id, formData)} style={{ padding: 4 }}>
                <FormInput label={t("tenancy.tenantName")} name="tenant_name" defaultValue={tItem.tenant_name} required />
                <div className="form-row">
                  <FormInput label={t("tenancy.tenantIC")} name="tenant_ic" defaultValue={tItem.tenant_ic ?? ""} />
                  <FormInput label={t("tenancy.tenantPhone")} name="tenant_phone" defaultValue={tItem.tenant_phone ?? ""} />
                </div>
                <FormInput label={t("tenancy.tenantEmail")} name="tenant_email" type="email" defaultValue={tItem.tenant_email ?? ""} />
                <div className="form-row">
                  <FormInput label={t("tenancy.startDate")} name="start_date" type="date" defaultValue={tItem.start_date} required />
                  <FormInput label={t("tenancy.endDate")} name="end_date" type="date" defaultValue={tItem.end_date} required />
                </div>
                <div className="form-row">
                  <FormInput label={`${t("tenancy.monthlyRent")} (RM)`} name="monthly_rent" type="number" defaultValue={tItem.monthly_rent ? String(tItem.monthly_rent) : ""} />
                  <FormInput label={`${t("tenancy.deposit")} (RM)`} name="deposit" type="number" defaultValue={tItem.deposit ? String(tItem.deposit) : ""} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label className="form-label">{t("tenancy.contractFile")}</label>
                  <FileUpload propertyId={propertyId} accept=".pdf,.jpg,.jpeg,.png"
                    existingFiles={tItem.contract_file_url ? [{ id: "", name: "contract", size: 0, type: "application/pdf", url: tItem.contract_file_url }] : []}
                    onUploaded={(url) => setContractUrl(url)} onDelete={() => setContractUrl("")} />
                  <input type="hidden" name="contract_file_url" value={contractUrl || tItem.contract_file_url || ""} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label className="form-label">{t("tenancy.passportFile")}</label>
                  <FileUpload propertyId={propertyId} accept=".pdf,.jpg,.jpeg,.png"
                    existingFiles={tItem.tenant_passport_url ? [{ id: "", name: "passport", size: 0, type: "application/pdf", url: tItem.tenant_passport_url }] : []}
                    onUploaded={(url) => setPassportUrl(url)} onDelete={() => setPassportUrl("")} />
                  <input type="hidden" name="tenant_passport_url" value={passportUrl || tItem.tenant_passport_url || ""} />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <Button variant="primary" size="sm" type="submit" disabled={pending}>{t("common.save")}</Button>
                  <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>{t("common.cancel")}</Button>
                </div>
              </form>
            ) : (
              <>
                <div className="tenancy-header">
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 17, marginRight: 8 }}>{tItem.tenant_name}</span>
                    <Badge color={tItem.status === "active" ? "green" : "gray"}>{statusLabel(tItem.status)}</Badge>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button variant="secondary" size="xs" onClick={() => setEditingId(tItem.id)}>{t("common.edit")}</Button>
                    <Button variant="danger" size="xs" onClick={() => handleDelete(tItem.id)} disabled={pending}>{t("common.delete")}</Button>
                  </div>
                </div>
                <div className="tenancy-body">
                  <div className="tenancy-field"><div className="tenancy-field-label">{t("tenancy.startDate")}</div><div className="tenancy-field-value">{tItem.start_date}</div></div>
                  <div className="tenancy-field"><div className="tenancy-field-label">{t("tenancy.endDate")}</div><div className="tenancy-field-value">{tItem.end_date}</div></div>
                  <div className="tenancy-field"><div className="tenancy-field-label">{t("tenancy.monthlyRent")}</div><div className="tenancy-field-value">{formatCurrency(tItem.monthly_rent || 0)}</div></div>
                  <div className="tenancy-field"><div className="tenancy-field-label">{t("tenancy.deposit")}</div><div className="tenancy-field-value">{formatCurrency(tItem.deposit || 0)}</div></div>
                  {tItem.tenant_phone && <div className="tenancy-field"><div className="tenancy-field-label">{t("tenancy.tenantPhone")}</div><div className="tenancy-field-value">{tItem.tenant_phone}</div></div>}
                  {tItem.tenant_ic && <div className="tenancy-field"><div className="tenancy-field-label">{t("tenancy.tenantIC")}</div><div className="tenancy-field-value">{tItem.tenant_ic}</div></div>}
                  {tItem.tenant_email && <div className="tenancy-field"><div className="tenancy-field-label">{t("tenancy.tenantEmail")}</div><div className="tenancy-field-value">{tItem.tenant_email}</div></div>}
                  {tItem.contract_file_url && (
                    <div className="tenancy-field"><div className="tenancy-field-label">{t("tenancy.contractFile")}</div>
                      <div className="tenancy-field-value"><a href={tItem.contract_file_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)", textDecoration: "underline" }}>📄 {t("tenancy.contractView")}</a></div>
                    </div>
                  )}
                  {tItem.tenant_passport_url && (
                    <div className="tenancy-field"><div className="tenancy-field-label">{t("tenancy.passportFile")}</div>
                      <div className="tenancy-field-value"><a href={tItem.tenant_passport_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)", textDecoration: "underline" }}>🪪 {t("tenancy.passportView")}</a></div>
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>
        ))
      )}
    </Card>
  );
}
