import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getInsurances } from "@/lib/api/insurances";
import { formatCurrency } from "@/lib/utils/formatters";
import { daysUntil } from "@/lib/utils/formatters";

const insuranceTypeIcons: Record<string, string> = {
  fire: "🔥",
  flood: "🌊",
  home: "🏠",
  mortgage: "🏦",
  other: "🛡️",
};

export default async function InsurancesPage() {
  const insurances = await getInsurances();

  const totalCoverage = insurances.reduce(
    (sum: number, ins: Record<string, unknown>) => sum + (Number(ins.coverage_amount) || 0),
    0
  );

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🛡️ 我的保险</div>
          <div className="page-subtitle">
            共 {insurances.length} 份保单
            {insurances.length > 0 && ` · 总保额 ${formatCurrency(totalCoverage)}`}
          </div>
        </div>
        <Link href="/dashboard/insurances/new">
          <Button variant="primary">+ 添加保险</Button>
        </Link>
      </div>

      {insurances.length === 0 ? (
        <Card variant="intense" style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
          <h3 style={{ marginBottom: 8 }}>还没有保险</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
            添加您的保单，到期及时提醒
          </p>
          <Link href="/dashboard/insurances/new">
            <Button>+ 添加第一份保单</Button>
          </Link>
        </Card>
      ) : (
        <div className="content-grid-3">
          {insurances.map((ins: Record<string, unknown>) => {
            const remaining = ins.end_date ? daysUntil(String(ins.end_date)) : 0;
            const statusColor =
              String(ins.status) === "expired" || remaining < 0 ? "red"
              : remaining <= 30 ? "amber"
              : "green";
            const statusText =
              String(ins.status) === "expired" || remaining < 0
                ? `已过期 ${Math.abs(remaining)} 天`
                : `有效期至 ${ins.end_date} · 剩余 ${remaining} 天`;

            return (
              <Card variant="default" className="property-card" key={String(ins.id)}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>
                  {insuranceTypeIcons[String(ins.insurance_type)] ?? "🛡️"}
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
                  {String(ins.insurance_type) === "fire" ? "火险"
                    : String(ins.insurance_type) === "flood" ? "水灾险"
                    : String(ins.insurance_type) === "home" ? "房屋保险"
                    : String(ins.insurance_type) === "mortgage" ? "房贷保险"
                    : String(ins.insurance_type)}
                </div>
                {ins.properties != null && (
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
                    🏢 {String((ins.properties as Record<string, unknown>).name ?? "")}
                  </div>
                )}
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
                  {ins.provider ? String(ins.provider) : ""}{ins.policy_no ? ` · ${String(ins.policy_no)}` : ""}
                </div>
                <div className="property-finance" style={{ marginBottom: 8 }}>
                  <div className="finance-item">
                    <div className="finance-label">保额</div>
                    <div className="finance-value" style={{ fontSize: 16 }}>
                      {formatCurrency(Number(ins.coverage_amount) || 0)}
                    </div>
                  </div>
                  <div className="finance-item">
                    <div className="finance-label">年费</div>
                    <div className="finance-value" style={{ fontSize: 16 }}>
                      {formatCurrency(Number(ins.annual_premium) || 0)}
                    </div>
                  </div>
                </div>
                <Badge color={statusColor}>{statusText}</Badge>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
