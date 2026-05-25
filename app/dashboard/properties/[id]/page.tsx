import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DataTable } from "@/components/ui/DataTable";
import { getProperty } from "@/lib/api/properties";
import { formatCurrency } from "@/lib/utils/formatters";
import { notFound } from "next/navigation";
import type { CoOwner } from "@/types/database";

const taxColumns = [
  { key: "tax_type", label: "税种" },
  { key: "authority", label: "机构" },
  { key: "account_no", label: "账号" },
  {
    key: "amount", label: "金额",
    render: (v: unknown) => formatCurrency(Number(v) || 0),
  },
  { key: "due_date", label: "截止日期" },
  {
    key: "status", label: "状态",
    render: (value: unknown) => {
      const status = value as string;
      const colors: Record<string, string> = { paid: "green", unpaid: "amber", overdue: "red" };
      const labels: Record<string, string> = { paid: "已缴", unpaid: "未缴", overdue: "逾期" };
      return <Badge color={colors[status] as "green" | "amber" | "red"}>{labels[status]}</Badge>;
    },
  },
];

const taxTypeLabels: Record<string, string> = {
  cukai_tanah: "土地税",
  cukai_pintu: "门牌税",
  cukai_petak: "地税",
  other: "其他",
};

const statusLabels: Record<string, string> = {
  rented: "出租中",
  vacant: "空置",
  non_rental: "自住",
  sold: "已售",
};

const propertyTypeLabels: Record<string, string> = {
  apartment: "公寓",
  landed: "有地房产",
  land: "土地",
  shop: "商铺",
  factory: "工厂",
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) notFound();

  const statusColor = property.status === "rented" ? "green" : property.status === "vacant" ? "amber" : "blue";

  return (
    <>
      <Breadcrumb
        items={[
          { label: "房产列表", href: "/dashboard/properties" },
          { label: property.name },
        ]}
      />

      <div className="detail-header glass-intense">
        <div className="detail-title-area">
          <div className="detail-title">{property.name}</div>
          <div className="detail-meta">
            <Badge color={statusColor}>{statusLabels[property.status] ?? property.status}</Badge>
            <Badge color="blue">{propertyTypeLabels[property.property_type] ?? property.property_type}</Badge>
          </div>
          <div className="detail-address">
            📍 {[property.address, property.city, property.state, property.postcode].filter(Boolean).join(", ")}
          </div>
        </div>
        <div className="detail-actions">
          <Link href={`/dashboard/properties/${property.id}/edit`}>
            <Button variant="secondary" size="sm">编辑</Button>
          </Link>
          <Button variant="danger" size="sm">删除</Button>
        </div>
        <div className="detail-stats">
          <div className="detail-stat">
            <div className="detail-stat-label">估值</div>
            <div className="detail-stat-value">{formatCurrency(property.current_value || 0)}</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">购买价格</div>
            <div className="detail-stat-value">{formatCurrency(property.purchase_price || 0)}</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">贷款余额</div>
            <div className="detail-stat-value">{formatCurrency(property.loan_balance || 0)}</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">地契编号</div>
            <div className="detail-stat-value" style={{ fontSize: 14 }}>{property.title_deed_no || "-"}</div>
          </div>
        </div>
      </div>

      <div className="content-grid-2" style={{ marginTop: 24 }}>
        <Card variant="intense" className="section-panel">
          <div className="section-title" style={{ marginBottom: 16 }}>🏠 房产信息</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><span style={{ color: "var(--text-secondary)", fontSize: 14 }}>类型: </span>{propertyTypeLabels[property.property_type] ?? property.property_type}</div>
            <div><span style={{ color: "var(--text-secondary)", fontSize: 14 }}>地契: </span>{property.title_deed_no || "-"}</div>
            {property.loan_bank && (
              <div><span style={{ color: "var(--text-secondary)", fontSize: 14 }}>贷款银行: </span>{property.loan_bank}</div>
            )}
          </div>
        </Card>

        <Card variant="intense" className="section-panel">
          <div className="section-title" style={{ marginBottom: 16 }}>👥 持有人</div>
          {property.co_owners && property.co_owners.length > 0 ? (
            property.co_owners.map((owner: CoOwner, i: number) => (
              <div className="owner-item" key={i}>
                <div
                  className="owner-avatar"
                  style={{
                    background: i === 0
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "linear-gradient(135deg, #ec4899, #f472b6)",
                  }}
                >
                  {String(owner.name ?? "").charAt(0)}
                </div>
                <div className="owner-info">
                  <div className="owner-name">{String(owner.name ?? "")}</div>
                  <div className="owner-role">{owner.is_primary ? "主要持有人" : "共同持有人"}</div>
                </div>
                <div className="owner-pct">{String(owner.ownership_pct ?? "")}%</div>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>暂无持有人信息</p>
          )}
        </Card>
      </div>

      {property.tenancies && property.tenancies.length > 0 && (
        <Card variant="intense" className="tenancy-card" style={{ marginTop: 24 }}>
          <div className="tenancy-header">
            <div>
              <span style={{ fontWeight: 700, fontSize: 17, marginRight: 8 }}>
                {String(property.tenancies[0].tenant_name ?? "")}
              </span>
              <Badge color="green">活跃</Badge>
            </div>
          </div>
          <div className="tenancy-body">
            <div className="tenancy-field">
              <div className="tenancy-field-label">开始日期</div>
              <div className="tenancy-field-value">{property.tenancies[0].start_date}</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">结束日期</div>
              <div className="tenancy-field-value">{property.tenancies[0].end_date}</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">月租</div>
              <div className="tenancy-field-value">{formatCurrency(Number(property.tenancies[0].monthly_rent) || 0)}</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">押金</div>
              <div className="tenancy-field-value">{formatCurrency(Number(property.tenancies[0].deposit) || 0)}</div>
            </div>
          </div>
        </Card>
      )}

      {property.taxes && property.taxes.length > 0 && (
        <Card variant="intense" className="section-panel" style={{ marginTop: 24 }}>
          <div className="section-header">
            <div className="section-title">📋 税务记录</div>
            <Button variant="secondary" size="sm">+ 添加税务记录</Button>
          </div>
          <DataTable
            columns={taxColumns}
            data={property.taxes.map((t: Record<string, unknown>) => ({
              ...t,
              tax_type: taxTypeLabels[String(t.tax_type ?? "")] ?? String(t.tax_type ?? ""),
            }))}
          />
        </Card>
      )}
    </>
  );
}
