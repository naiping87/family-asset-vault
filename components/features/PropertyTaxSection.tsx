"use client";

import { useState, useTransition } from "react";
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

const taxTypeLabels: Record<string, string> = {
  cukai_tanah: "土地税",
  cukai_pintu: "门牌税",
  cukai_petak: "地税",
  other: "其他",
};

interface Props {
  propertyId: string;
  taxes: Tax[];
}

export function PropertyTaxSection({ propertyId, taxes }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();
  const [receiptUrl, setReceiptUrl] = useState("");

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const result = await addTaxAction(propertyId, formData);
      if (result?.error) {
        showToast(result.error, "error");
      } else {
        showToast("税务记录已添加", "success");
        setShowForm(false);
      }
    });
  }

  function handleMarkPaid(taxId: string) {
    startTransition(async () => {
      const result = await markTaxPaidAction(propertyId, taxId);
      if (result?.error) {
        showToast(result.error, "error");
      } else {
        showToast("已标记为已缴", "success");
      }
    });
  }

  function handleDelete(taxId: string) {
    startTransition(async () => {
      const result = await deleteTaxAction(propertyId, taxId);
      if (result?.error) {
        showToast(result.error, "error");
      } else {
        showToast("税务记录已删除", "success");
      }
    });
  }

  const taxColumns = [
    { key: "tax_type", label: "税种" },
    { key: "authority", label: "机构" },
    { key: "account_no", label: "账号" },
    { key: "amount", label: "金额", render: (v: unknown) => formatCurrency(Number(v) || 0) },
    { key: "due_date", label: "截止日期" },
    {
      key: "status", label: "状态",
      render: (value: unknown) => {
        const s = String(value ?? "");
        const c: Record<string, string> = { paid: "green", unpaid: "amber", overdue: "red" };
        const l: Record<string, string> = { paid: "已缴", unpaid: "未缴", overdue: "逾期" };
        return <Badge color={c[s] as "green" | "amber" | "red"}>{l[s]}</Badge>;
      },
    },
    {
      key: "actions", label: "操作",
      render: (_: unknown, row: Record<string, unknown>) => (
        <div style={{ display: "flex", gap: 6 }}>
          {row.status !== "paid" && (
            <Button variant="secondary" size="xs" onClick={() => handleMarkPaid(String(row.id))} disabled={pending}>
              标记已缴
            </Button>
          )}
          <Button variant="danger" size="xs" onClick={() => handleDelete(String(row.id))} disabled={pending}>
            删除
          </Button>
        </div>
      ),
    },
  ];

  const tableData = taxes.map((t) => ({ ...t, tax_type: taxTypeLabels[t.tax_type] ?? t.tax_type }));

  return (
    <Card variant="intense" className="section-panel" style={{ marginTop: 24 }}>
      <div className="section-header">
        <div className="section-title">📋 税务记录</div>
        <Button variant="secondary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "取消" : "+ 添加税务记录"}
        </Button>
      </div>
      {showForm && (
        <form action={handleAdd}
          style={{ marginBottom: 20, padding: 16, background: "var(--glass-bg)", borderRadius: "var(--radius)" }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">税种</label>
              <select className="form-input" name="tax_type" defaultValue="cukai_pintu">
                <option value="cukai_pintu">门牌税</option>
                <option value="cukai_tanah">土地税</option>
                <option value="cukai_petak">地税</option>
                <option value="other">其他</option>
              </select>
            </div>
            <FormInput label="机构" name="authority" placeholder="例如：DBKL" />
          </div>
          <div className="form-row">
            <FormInput label="账号" name="account_no" placeholder="例如：A-2024-00123" />
            <FormInput label="金额 (RM)" name="amount" type="number" placeholder="0.00" />
          </div>
          <FormInput label="截止日期" name="due_date" type="date" />
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">收据/账单文件</label>
            <FileUpload
              propertyId={propertyId}
              accept=".pdf,.jpg,.jpeg,.png"
              existingFiles={receiptUrl ? [{ id: "", name: "收据文件", size: 0, type: "application/pdf", url: receiptUrl }] : []}
              onUploaded={setReceiptUrl}
              onDelete={() => setReceiptUrl("")}
            />
            <input type="hidden" name="receipt_url" value={receiptUrl} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" size="sm" type="submit" disabled={pending}>保存</Button>
          </div>
        </form>
      )}
      {tableData.length > 0 ? (
        <DataTable columns={taxColumns} data={tableData} />
      ) : (
        <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", padding: 20 }}>暂无税务记录</p>
      )}
    </Card>
  );
}
