"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FormInput } from "@/components/ui/FormInput";
import { FileUpload } from "@/components/ui/FileUpload";
import { DataTable } from "@/components/ui/DataTable";
import { showToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils/formatters";
import { addTaxAction, markTaxPaidAction, deleteTaxAction } from "@/app/dashboard/properties/[id]/tax-actions";
import type { Tax } from "@/types/database";

interface Props {
  propertyId: string;
  taxes: Tax[];
}

export function PropertyTaxSection({ propertyId, taxes }: Props) {
  const t = useTranslations();
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();
  const [receiptUrl, setReceiptUrl] = useState("");

  const taxTypeLabels: Record<string, string> = {
    cukai_tanah: t("tax.cukaiTanah"), cukai_pintu: t("tax.cukaiPintu"), cukai_petak: t("tax.cukaiPetak"), other: t("insurance.other"),
  };

  function statusLabel(s: string) {
    if (s === "paid") return t("tax.paid");
    if (s === "unpaid") return t("tax.unpaid");
    return t("tax.overdue");
  }

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const result = await addTaxAction(propertyId, formData);
      if (result?.error) { showToast(result.error, "error"); }
      else { showToast(t("tax.added"), "success"); setShowForm(false); }
    });
  }

  function handleMarkPaid(taxId: string) {
    startTransition(async () => {
      const result = await markTaxPaidAction(propertyId, taxId);
      if (result?.error) { showToast(result.error, "error"); }
      else { showToast(t("tax.markedPaid"), "success"); }
    });
  }

  function handleDelete(taxId: string) {
    startTransition(async () => {
      const result = await deleteTaxAction(propertyId, taxId);
      if (result?.error) { showToast(result.error, "error"); }
      else { showToast(t("tax.deleted"), "success"); }
    });
  }

  const taxColumns = [
    { key: "tax_type", label: t("tax.type") },
    { key: "authority", label: t("tax.authority") },
    { key: "account_no", label: t("tax.accountNo") },
    { key: "amount", label: t("tax.amount"), render: (v: unknown) => formatCurrency(Number(v) || 0) },
    { key: "due_date", label: t("tax.dueDate") },
    { key: "status", label: t("property.status"), render: (value: unknown) => {
      const s = String(value ?? "");
      const c: Record<string, string> = { paid: "green", unpaid: "amber", overdue: "red" };
      return <Badge color={c[s] as "green" | "amber" | "red"}>{statusLabel(s)}</Badge>;
    }},
    { key: "actions", label: t("common.edit"), render: (_: unknown, row: Record<string, unknown>) => (
      <div style={{ display: "flex", gap: 6 }}>
        {row.status !== "paid" && <Button variant="secondary" size="xs" onClick={() => handleMarkPaid(String(row.id))} disabled={pending}>{t("tax.markPaid")}</Button>}
        <Button variant="danger" size="xs" onClick={() => handleDelete(String(row.id))} disabled={pending}>{t("common.delete")}</Button>
      </div>
    )},
  ];

  const tableData = taxes.map((item) => ({ ...item, tax_type: taxTypeLabels[item.tax_type] ?? item.tax_type }));

  return (
    <Card variant="intense" className="section-panel" style={{ marginTop: 24 }}>
      <div className="section-header">
        <div className="section-title">📋 {t("property.taxRecords")}</div>
        <Button variant="secondary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? t("common.cancel") : `+ ${t("property.taxAdd")}`}
        </Button>
      </div>
      {showForm && (
        <form action={handleAdd} style={{ marginBottom: 20, padding: 16, background: "var(--glass-bg)", borderRadius: "var(--radius)" }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t("tax.type")}</label>
              <select className="form-input" name="tax_type" defaultValue="cukai_pintu">
                <option value="cukai_pintu">{t("tax.cukaiPintu")}</option>
                <option value="cukai_tanah">{t("tax.cukaiTanah")}</option>
                <option value="cukai_petak">{t("tax.cukaiPetak")}</option>
                <option value="other">{t("insurance.other")}</option>
              </select>
            </div>
            <FormInput label={t("tax.authority")} name="authority" placeholder={t("tax.authorityPlaceholder")} />
          </div>
          <div className="form-row">
            <FormInput label={t("tax.accountNo")} name="account_no" placeholder={t("tax.accountNoPlaceholder")} />
            <FormInput label={`${t("tax.amount")} (RM)`} name="amount" type="number" placeholder="0.00" />
          </div>
          <FormInput label={t("tax.dueDate")} name="due_date" type="date" />
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">{t("tax.receiptFile")}</label>
            <FileUpload propertyId={propertyId} accept=".pdf,.jpg,.jpeg,.png"
              existingFiles={receiptUrl ? [{ id: "", name: "receipt", size: 0, type: "application/pdf", url: receiptUrl }] : []}
              onUploaded={setReceiptUrl} onDelete={() => setReceiptUrl("")} />
            <input type="hidden" name="receipt_url" value={receiptUrl} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" size="sm" type="submit" disabled={pending}>{t("common.save")}</Button>
          </div>
        </form>
      )}
      {tableData.length > 0 ? (
        <DataTable columns={taxColumns} data={tableData} />
      ) : (
        <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", padding: 20 }}>{t("property.noTaxes")}</p>
      )}
    </Card>
  );
}
