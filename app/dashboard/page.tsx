import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getGreeting, formatFullDate } from "@/lib/utils/formatters";
import { PropertyCard } from "@/components/ui/PropertyCard";

export default function DashboardPage() {
  const greeting = getGreeting();
  const today = formatFullDate(new Date());

  return (
    <>
      <div className="greeting">
        <div className="greeting-text">
          {greeting}，张先生 👋
        </div>
        <div className="greeting-date">{today}</div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          icon="📊"
          iconColor="blue"
          label="总资产估值"
          value="RM 2.85M"
          sub="↑ 5.2% 较去年"
          subUp
        />
        <StatsCard
          icon="🏠"
          iconColor="green"
          label="房产数量"
          value="4"
          sub="2 出租 · 1 自住 · 1 空置"
        />
        <StatsCard
          icon="💰"
          iconColor="amber"
          label="月租金收入"
          value="RM 8,500"
          sub="年化 RM 102,000"
        />
        <StatsCard
          icon="🛡️"
          iconColor="purple"
          label="保单数量"
          value="3"
          sub="1 份即将到期"
        />
      </div>

      {/* Reminders & Quick Actions */}
      <div className="content-grid-2">
        <Card variant="intense" className="section-panel">
          <div className="section-header">
            <div className="section-title">⏰ 待办提醒</div>
          </div>
          <div className="reminder-list">
            <div className="reminder-item">
              <div className="reminder-dot danger" />
              <div className="reminder-info">
                <div className="reminder-title">房屋保险即将到期</div>
                <div className="reminder-sub">Etiqa · HI-2025-045 · SkyVue 高级公寓</div>
              </div>
              <span className="reminder-days danger">已过期 5 天</span>
            </div>
            <div className="reminder-item">
              <div className="reminder-dot warning" />
              <div className="reminder-info">
                <div className="reminder-title">火险即将到期</div>
                <div className="reminder-sub">Allianz · FL-2026-001 · SkyVue 高级公寓</div>
              </div>
              <span className="reminder-days warning">225 天</span>
            </div>
            <div className="reminder-item">
              <div className="reminder-dot info" />
              <div className="reminder-info">
                <div className="reminder-title">门牌税缴付截止</div>
                <div className="reminder-sub">DBKL · 账号 A-2024-00123 · SS3 半独立洋房</div>
              </div>
              <span className="reminder-days info">45 天</span>
            </div>
          </div>
        </Card>

        <Card variant="intense" className="section-panel">
          <div className="section-header">
            <div className="section-title">⚡ 快速操作</div>
          </div>
          <div className="quick-actions">
            <Link href="/dashboard/properties/new" className="quick-action-btn">
              <span className="icon blue">🏠</span>
              <span className="quick-action-label">添加房产</span>
            </Link>
            <Link href="/dashboard/insurances" className="quick-action-btn">
              <span className="icon green">🛡️</span>
              <span className="quick-action-label">添加保险</span>
            </Link>
            <Link href="/dashboard/properties" className="quick-action-btn">
              <span className="icon amber">📋</span>
              <span className="quick-action-label">查看房产</span>
            </Link>
            <Link href="/dashboard/properties" className="quick-action-btn">
              <span className="icon purple">📄</span>
              <span className="quick-action-label">管理文件</span>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Properties */}
      <Card variant="intense" className="section-panel">
        <div className="section-header">
          <div className="section-title">🏘️ 最近房产</div>
          <Link href="/dashboard/properties">
            <Badge color="blue">查看全部 →</Badge>
          </Link>
        </div>
        <div className="content-grid-2">
          <Link href="/dashboard/properties/skyvue" style={{ textDecoration: "none", color: "inherit" }}>
            <PropertyCard
              name="SkyVue 高级公寓"
              address="Jalan SkyVue, Kuala Lumpur"
              badge={<Badge color="green">出租中</Badge>}
              finance={[
                { label: "估值", value: "RM 850K" },
                { label: "月租", value: "RM 3,500" },
              ]}
            />
          </Link>
          <Link href="/dashboard/properties/ss3" style={{ textDecoration: "none", color: "inherit" }}>
            <PropertyCard
              name="SS3 半独立洋房"
              address="Jalan SS3/14, Petaling Jaya"
              badge={<Badge color="blue">自住</Badge>}
              finance={[
                { label: "估值", value: "RM 1.2M" },
                { label: "贷款余额", value: "RM 450K" },
              ]}
            />
          </Link>
        </div>
      </Card>
    </>
  );
}
