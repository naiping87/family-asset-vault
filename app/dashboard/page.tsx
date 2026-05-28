import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { getGreeting, formatFullDate, formatCurrency } from "@/lib/utils/formatters";
import { getDashboardStats, getReminders, getRecentProperties } from "@/lib/api/dashboard";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, Building2, Wallet, Shield, Plus, List, FileText, Clock } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const greeting = getGreeting();
  const today = formatFullDate(new Date());
  const stats = await getDashboardStats();
  const reminders = await getReminders();
  const recentProperties = await getRecentProperties(4);

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "用户";

  return (
    <div className="page-enter">
      <div className="greeting">
        <div className="greeting-text">
          {greeting}，{displayName} 👋
        </div>
        <div className="greeting-date">{today}</div>
      </div>

      <div className="stats-grid">
        <StatsCard
          icon={<LayoutDashboard size={24} />}
          iconColor="blue"
          label="总资产估值"
          value={stats ? formatCurrency(stats.total_value) : "RM 0"}
          sub={stats ? `${stats.total_properties} 处房产` : "暂无数据"}
        />
        <StatsCard
          icon={<Building2 size={24} />}
          iconColor="green"
          label="房产数量"
          value={stats ? String(stats.total_properties) : "0"}
          sub={stats ? `${stats.rented_count} 出租 · ${stats.non_rental_count} 自住 · ${stats.vacant_count} 空置` : "暂无数据"}
        />
        <StatsCard
          icon={<Wallet size={24} />}
          iconColor="amber"
          label="月租金收入"
          value={stats ? formatCurrency(stats.monthly_rental_income) : "RM 0"}
          sub={stats ? `年化 ${formatCurrency(stats.monthly_rental_income * 12)}` : "暂无数据"}
        />
        <StatsCard
          icon={<Shield size={24} />}
          iconColor="purple"
          label="保单数量"
          value={stats ? String(stats.active_insurances) : "0"}
          sub={stats && stats.active_insurances > 0 ? "管理您的保险" : "暂无保单"}
        />
      </div>

      <div className="content-grid-2">
        <Card variant="intense" className="section-panel">
          <div className="section-header">
            <div className="section-title"><Clock size={18} style={{ display: "inline", marginRight: 6, verticalAlign: -3 }} />待办提醒</div>
          </div>
          {reminders.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-secondary)" }}>
              暂无待办事项 🎉
            </div>
          ) : (
            <div className="reminder-list">
              {reminders.map((r, i) => (
                <div className="reminder-item" key={i}>
                  <div className={`reminder-dot ${r.type}`} />
                  <div className="reminder-info">
                    <div className="reminder-title">{r.title}</div>
                    <div className="reminder-sub">{r.sub}</div>
                  </div>
                  <span className={`reminder-days ${r.type}`}>
                    {r.days < 0 ? `已过期 ${Math.abs(r.days)} 天` : `${r.days} 天`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card variant="intense" className="section-panel">
          <div className="section-header">
            <div className="section-title">⚡ 快速操作</div>
          </div>
          <div className="quick-actions">
            <Link href="/dashboard/properties/new" className="quick-action-btn">
              <span className="icon blue"><Building2 size={22} /></span>
              <span className="quick-action-label">添加房产</span>
            </Link>
            <Link href="/dashboard/insurances/new" className="quick-action-btn">
              <span className="icon green"><Shield size={22} /></span>
              <span className="quick-action-label">添加保险</span>
            </Link>
            <Link href="/dashboard/properties" className="quick-action-btn">
              <span className="icon amber"><List size={22} /></span>
              <span className="quick-action-label">查看房产</span>
            </Link>
            <Link href="/dashboard/properties" className="quick-action-btn">
              <span className="icon purple"><FileText size={22} /></span>
              <span className="quick-action-label">管理文件</span>
            </Link>
          </div>
        </Card>
      </div>

      <Card variant="intense" className="section-panel">
        <div className="section-header">
          <div className="section-title"><Building2 size={18} style={{ display: "inline", marginRight: 6, verticalAlign: -3 }} />最近房产</div>
          <Link href="/dashboard/properties">
            <Badge color="blue">查看全部 →</Badge>
          </Link>
        </div>
        {recentProperties.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--text-secondary)" }}>
            <p style={{ marginBottom: 16 }}>还没有添加房产</p>
            <Link href="/dashboard/properties/new">
              <Badge color="blue">+ 添加第一处房产</Badge>
            </Link>
          </div>
        ) : (
          <div className="content-grid-2">
            {recentProperties.map((p: Record<string, unknown>) => (
              <Link
                key={String(p.id)}
                href={`/dashboard/properties/${p.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <PropertyCard
                  name={String(p.name ?? "")}
                  address={[p.city, p.state].filter(Boolean).join(", ") || String(p.address ?? "")}
                  badge={
                    <Badge color={p.status === "rented" ? "green" : p.status === "vacant" ? "amber" : "blue"}>
                      {p.status === "rented" ? "出租中" : p.status === "vacant" ? "空置" : "自住"}
                    </Badge>
                  }
                  finance={[
                    { label: "估值", value: formatCurrency(Number(p.current_value) || 0) },
                    ...(p.status === "rented"
                      ? [{ label: "月租", value: formatCurrency(0) }]
                      : [{ label: "贷款余额", value: formatCurrency(Number(p.loan_balance) || 0) }]),
                  ]}
                />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
