import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getProperty } from "@/lib/api/properties";
import { formatCurrency } from "@/lib/utils/formatters";
import { notFound } from "next/navigation";
import { DeletePropertyButton } from "@/components/features/DeletePropertyButton";
import { PropertyCoOwnerSection } from "@/components/features/PropertyCoOwnerSection";
import { PropertyTenancySection } from "@/components/features/PropertyTenancySection";
import { PropertyTaxSection } from "@/components/features/PropertyTaxSection";

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
            <Badge color="blue">编辑</Badge>
          </Link>
          <DeletePropertyButton propertyId={property.id} />
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
          <PropertyCoOwnerSection
            propertyId={property.id}
            coOwners={property.co_owners ?? []}
          />
        </Card>
      </div>

      <PropertyTenancySection
        propertyId={property.id}
        tenancies={property.tenancies ?? []}
      />

      <PropertyTaxSection
        propertyId={property.id}
        taxes={property.taxes ?? []}
      />
    </>
  );
}
