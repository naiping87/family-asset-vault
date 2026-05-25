"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FormInput } from "@/components/ui/FormInput";
import { formatCurrency } from "@/lib/utils/formatters";
import { addTenancyAction } from "@/app/dashboard/properties/[id]/tenancy-actions";
import type { Tenancy } from "@/types/database";

interface Props {
  propertyId: string;
  tenancies: Tenancy[];
}

export function PropertyTenancySection({ propertyId, tenancies }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <Card variant="intense" className="section-panel" style={{ marginTop: 24 }}>
      <div className="section-header">
        <div className="section-title">🏠 租约管理</div>
        <Button variant="secondary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "取消" : "+ 添加租约"}
        </Button>
      </div>

      {showForm && (
        <form
          action={async (formData: FormData) => {
            await addTenancyAction(propertyId, formData);
          }}
          style={{
            marginBottom: 20,
            padding: 16,
            background: "var(--glass-bg)",
            borderRadius: "var(--radius)",
          }}
        >
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
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" size="sm" type="submit">保存</Button>
          </div>
        </form>
      )}

      {tenancies.length === 0 ? (
        <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", padding: 20 }}>
          暂无租约记录
        </p>
      ) : (
        tenancies.map((t) => (
          <Card variant="default" key={t.id} className="tenancy-card" style={{ marginBottom: 12 }}>
            <div className="tenancy-header">
              <div>
                <span style={{ fontWeight: 700, fontSize: 17, marginRight: 8 }}>
                  {t.tenant_name}
                </span>
                <Badge color={t.status === "active" ? "green" : "gray"}>
                  {t.status === "active" ? "活跃" : t.status === "expired" ? "已到期" : "已终止"}
                </Badge>
              </div>
            </div>
            <div className="tenancy-body">
              <div className="tenancy-field">
                <div className="tenancy-field-label">开始日期</div>
                <div className="tenancy-field-value">{t.start_date}</div>
              </div>
              <div className="tenancy-field">
                <div className="tenancy-field-label">结束日期</div>
                <div className="tenancy-field-value">{t.end_date}</div>
              </div>
              <div className="tenancy-field">
                <div className="tenancy-field-label">月租</div>
                <div className="tenancy-field-value">{formatCurrency(t.monthly_rent || 0)}</div>
              </div>
              <div className="tenancy-field">
                <div className="tenancy-field-label">押金</div>
                <div className="tenancy-field-value">{formatCurrency(t.deposit || 0)}</div>
              </div>
              {t.tenant_phone && (
                <div className="tenancy-field">
                  <div className="tenancy-field-label">电话</div>
                  <div className="tenancy-field-value">{t.tenant_phone}</div>
                </div>
              )}
              {t.tenant_ic && (
                <div className="tenancy-field">
                  <div className="tenancy-field-label">IC 号码</div>
                  <div className="tenancy-field-value">{t.tenant_ic}</div>
                </div>
              )}
            </div>
          </Card>
        ))
      )}
    </Card>
  );
}
