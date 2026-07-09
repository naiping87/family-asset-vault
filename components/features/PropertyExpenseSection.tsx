"use client";

import { useState, useTransition } from "react";
import { useT } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FormInput } from "@/components/ui/FormInput";
import { FileUpload } from "@/components/ui/FileUpload";
import { DataTable } from "@/components/ui/DataTable";
import { showToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils/formatters";
import { addExpenseAction, editExpenseAction, markExpensePaidAction, deleteExpenseAction } from "@/app/dashboard/properties/[id]/expense-actions";
import type { Expense } from "@/types/database";

interface Props {
  propertyId: string;
  expenses: Expense[];
}

export function PropertyExpenseSection({ propertyId, expenses }: Props) {
  const { t } = useT();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [receiptUrl, setReceiptUrl] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);

  const expenseTypeLabels: Record<string, string> = {
    utility: t("expense.utility"),
    electricity: t("expense.electricity"),
    fire_insurance: t("expense.fireInsurance"),
    gated_guarded: t("expense.gatedGuarded"),
    maintenance: t("expense.maintenance"),
    other: t("insurance.other"),
  };

  function statusLabel(s: string) {
    if (s === "paid") return t("tax.paid");
    if (s === "unpaid") return t("tax.unpaid");
    return t("tax.overdue");
  }

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const result = await addExpenseAction(propertyId, formData);
      if (result?.error) { showToast(result.error, "error"); }
      else { showToast(t("expense.added"), "success"); setShowForm(false); setReceiptUrl(""); }
    });
  }

  function handleEdit(expenseId: string, formData: FormData) {
    startTransition(async () => {
      const result = await editExpenseAction(propertyId, expenseId, formData);
      if (result?.error) { showToast(result.error, "error"); }
      else { showToast(t("expense.updated"), "success"); setEditingId(null); }
    });
  }

  function handleMarkPaid(expenseId: string) {
    startTransition(async () => {
      const result = await markExpensePaidAction(propertyId, expenseId);
      if (result?.error) { showToast(result.error, "error"); }
      else { showToast(t("expense.markedPaid"), "success"); }
    });
  }

  function handleDelete(expenseId: string) {
    startTransition(async () => {
      const result = await deleteExpenseAction(propertyId, expenseId);
      if (result?.error) { showToast(result.error, "error"); }
      else { showToast(t("expense.deleted"), "success"); }
    });
  }

  const columns = [
    { key: "expense_type", label: t("expense.type"), render: (v: unknown) => {
      const label = expenseTypeLabels[String(v)] || String(v);
      const colors: Record<string, string> = { utility: "blue", electricity: "amber", fire_insurance: "red", gated_guarded: "purple", maintenance: "green", other: "gray" };
      return <Badge color={colors[String(v)] as "blue" | "amber" | "red" | "purple" | "green" | "gray"}>{label}</Badge>;
    }},
    { key: "description", label: t("expense.description") },
    { key: "amount", label: t("expense.amount"), render: (v: unknown) => formatCurrency(Number(v) || 0) },
    { key: "due_date", label: t("expense.dueDate") },
    { key: "receipt_url", label: t("expense.receiptFile"), render: (v: unknown) => {
      const url = String(v ?? "");
      return url ? <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)", fontSize: 13 }}>{t("common.view")}</a> : <span style={{ color: "var(--text-muted)", fontSize: 13 }}>-</span>;
    }},
    { key: "status", label: t("property.status"), render: (value: unknown) => {
      const s = String(value ?? "");
      const c: Record<string, string> = { paid: "green", unpaid: "amber", overdue: "red" };
      return <Badge color={c[s] as "green" | "amber" | "red"}>{statusLabel(s)}</Badge>;
    }},
    { key: "actions", label: t("common.edit"), render: (_: unknown, row: Record<string, unknown>) => (
      <div style={{ display: "flex", gap: 6 }}>
        {row.status !== "paid" && <Button variant="secondary" size="xs" onClick={() => handleMarkPaid(String(row.id))} disabled={pending}>{t("expense.markPaid")}</Button>}
        <Button variant="danger" size="xs" onClick={() => handleDelete(String(row.id))} disabled={pending}>{t("common.delete")}</Button>
      </div>
    )},
  ];

  const tableData = expenses.map((item) => ({ ...item, expense_type: expenseTypeLabels[item.expense_type] ?? item.expense_type }));

  return (
    <Card variant="intense" className="section-panel" style={{ marginTop: 24 }}>
      <div className="section-header">
        <div className="section-title">{t("expense.title")}</div>
        <Button variant="secondary" size="sm" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          {showForm && !editingId ? t("common.cancel") : "+ " + t("expense.addExpense")}
        </Button>
      </div>
      {showForm && !editingId && (
        <form action={handleAdd} style={{ marginBottom: 20, padding: 16, background: "var(--glass-bg)", borderRadius: "var(--radius)" }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t("expense.type")}</label>
              <select className="form-input" name="expense_type" defaultValue="maintenance">
                <option value="utility">{t("expense.utility")}</option>
                <option value="electricity">{t("expense.electricity")}</option>
                <option value="fire_insurance">{t("expense.fireInsurance")}</option>
                <option value="gated_guarded">{t("expense.gatedGuarded")}</option>
                <option value="maintenance">{t("expense.maintenance")}</option>
                <option value="other">{t("insurance.other")}</option>
              </select>
            </div>
            <FormInput label={t("expense.amount") + " (RM)"} name="amount" type="number" placeholder="0.00" />
          </div>
          <FormInput label={t("expense.description")} name="description" placeholder={t("expense.descriptionPlaceholder")} />
          <FormInput label={t("expense.dueDate")} name="due_date" type="date" />
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">{t("expense.receiptFile")}</label>
            <FileUpload propertyId={propertyId} accept=".pdf,.jpg,.jpeg,.png"
              existingFiles={receiptUrl ? [{ id: "", name: "receipt", size: 0, type: "application/pdf", url: receiptUrl }] : []}
              onUploaded={setReceiptUrl} onDelete={() => setReceiptUrl("")} onUploadingChange={setUploadingFile} />
            <input type="hidden" name="receipt_url" value={receiptUrl} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" size="sm" type="submit" disabled={pending || uploadingFile}>{uploadingFile ? t("upload.uploading") : t("common.save")}</Button>
          </div>
        </form>
      )}
      {tableData.length > 0 ? (
        <DataTable columns={columns} data={tableData} />
      ) : (
        <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", padding: 20 }}>{t("expense.noExpenses")}</p>
      )}
    </Card>
  );
}
