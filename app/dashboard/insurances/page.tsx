import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function InsurancesPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🛡️ 我的保险</div>
          <div className="page-subtitle">共 3 份保单 · 总保额 RM 1.5M</div>
        </div>
        <Button variant="primary">+ 添加保险</Button>
      </div>

      <div className="content-grid-3">
        <Card variant="default" className="property-card">
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔥</div>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>火险</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
            🏢 SkyVue 高级公寓
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
            Allianz · FL-2026-001
          </div>
          <div className="property-finance" style={{ marginBottom: 8 }}>
            <div className="finance-item">
              <div className="finance-label">保额</div>
              <div className="finance-value" style={{ fontSize: 16 }}>RM 500K</div>
            </div>
            <div className="finance-item">
              <div className="finance-label">年费</div>
              <div className="finance-value" style={{ fontSize: 16 }}>RM 1,200</div>
            </div>
          </div>
          <Badge color="green">有效期至 2026-12-31 · 225 天</Badge>
        </Card>

        <Card variant="default" className="property-card">
          <div style={{ fontSize: 28, marginBottom: 8 }}>🌊</div>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>水灾险</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
            🏠 SS3 半独立洋房
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
            AIA · FH-2026-089
          </div>
          <div className="property-finance" style={{ marginBottom: 8 }}>
            <div className="finance-item">
              <div className="finance-label">保额</div>
              <div className="finance-value" style={{ fontSize: 16 }}>RM 800K</div>
            </div>
            <div className="finance-item">
              <div className="finance-label">年费</div>
              <div className="finance-value" style={{ fontSize: 16 }}>RM 2,400</div>
            </div>
          </div>
          <Badge color="amber">有效期至 2026-09-15 · 118 天</Badge>
        </Card>

        <Card variant="default" className="property-card">
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏠</div>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>房屋保险</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
            🏢 SkyVue 高级公寓
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
            Etiqa · HI-2025-045
          </div>
          <div className="property-finance" style={{ marginBottom: 8 }}>
            <div className="finance-item">
              <div className="finance-label">保额</div>
              <div className="finance-value" style={{ fontSize: 16 }}>RM 200K</div>
            </div>
            <div className="finance-item">
              <div className="finance-label">年费</div>
              <div className="finance-value" style={{ fontSize: 16 }}>RM 850</div>
            </div>
          </div>
          <Badge color="red">已过期 5 天！</Badge>
        </Card>
      </div>
    </>
  );
}
