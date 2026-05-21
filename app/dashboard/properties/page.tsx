import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FilterPills } from "@/components/ui/FilterPills";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Card } from "@/components/ui/Card";
import { getProperties } from "@/lib/api/properties";
import { formatCurrency } from "@/lib/utils/formatters";
import type { Property } from "@/types/database";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🏘️ 我的房产</div>
          <div className="page-subtitle">
            共 {properties.length} 处房产
            {properties.length > 0 && ` · 总估值 ${formatCurrency(
              properties.reduce((sum: number, p: Property) => sum + (p.current_value || 0), 0)
            )}`}
          </div>
        </div>
        <Link href="/dashboard/properties/new">
          <Button variant="primary">+ 添加房产</Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <Card variant="intense" style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
          <h3 style={{ marginBottom: 8 }}>还没有添加房产</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
            开始记录您的房产资产吧
          </p>
          <Link href="/dashboard/properties/new">
            <Button>+ 添加第一处房产</Button>
          </Link>
        </Card>
      ) : (
        <div className="content-grid-2">
          {properties.map((p: Property) => (
            <Link
              key={p.id}
              href={`/dashboard/properties/${p.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <PropertyCard
                name={p.name}
                address={[p.city, p.state].filter(Boolean).join(", ") || p.address || ""}
                badge={
                  <Badge
                    color={
                      p.status === "rented" ? "green" : p.status === "vacant" ? "amber" : "blue"
                    }
                  >
                    {p.status === "rented" ? "出租中" : p.status === "vacant" ? "空置" : "自住"}
                  </Badge>
                }
                finance={[
                  { label: "估值", value: formatCurrency(p.current_value || 0) },
                  { label: "贷款余额", value: formatCurrency(p.loan_balance || 0) },
                ]}
              />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
