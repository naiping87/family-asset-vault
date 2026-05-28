import Link from "next/link";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, language")
    .eq("id", user?.id ?? "")
    .single();

  const greeting = getGreeting(profile?.language || "zh");
  const today = formatFullDate(new Date());
  const stats = await getDashboardStats();
  const reminders = await getReminders();
  const recentProperties = await getRecentProperties(4);

  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "用户";

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
          label={t("dashboard.totalValue")}
          value={stats ? formatCurrency(stats.total_value) : "RM 0"}
          sub={stats ? `${stats.total_properties} ${t("dashboard.propertiesUnit")}` : t("common.noData")}
        />
        <StatsCard
          icon={<Building2 size={24} />}
          iconColor="green"
          label={t("dashboard.propertyCount")}
          value={stats ? String(stats.total_properties) : "0"}
          sub={stats ? `${stats.rented_count} ${t("dashboard.rentedCount")} · ${stats.non_rental_count} ${t("dashboard.occupiedCount")} · ${stats.vacant_count} ${t("dashboard.vacantCount")}` : t("common.noData")}
        />
        <StatsCard
          icon={<Wallet size={24} />}
          iconColor="amber"
          label={t("dashboard.monthlyRental")}
          value={stats ? formatCurrency(stats.monthly_rental_income) : "RM 0"}
          sub={stats ? `${t("dashboard.annualRental")} ${formatCurrency(stats.monthly_rental_income * 12)}` : t("common.noData")}
        />
        <StatsCard
          icon={<Shield size={24} />}
          iconColor="purple"
          label={t("dashboard.insuranceCount")}
          value={stats ? String(stats.active_insurances) : "0"}
          sub={stats && stats.active_insurances > 0 ? t("dashboard.manageInsurance") : t("common.noData")}
        />
      </div>

      <div className="content-grid-2">
        <Card variant="intense" className="section-panel">
          <div className="section-header">
            <div className="section-title"><Clock size={18} style={{ display: "inline", marginRight: 6, verticalAlign: -3 }} />{t("dashboard.reminders")}</div>
          </div>
          {reminders.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-secondary)" }}>
              {t("dashboard.noReminders")} 🎉
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
            <div className="section-title">⚡ {t("dashboard.quickActions")}</div>
          </div>
          <div className="quick-actions">
            <Link href="/dashboard/properties/new" className="quick-action-btn">
              <span className="icon blue"><Building2 size={22} /></span>
              <span className="quick-action-label">{t("dashboard.addProperty")}</span>
            </Link>
            <Link href="/dashboard/insurances/new" className="quick-action-btn">
              <span className="icon green"><Shield size={22} /></span>
              <span className="quick-action-label">{t("dashboard.addInsurance")}</span>
            </Link>
            <Link href="/dashboard/properties" className="quick-action-btn">
              <span className="icon amber"><List size={22} /></span>
              <span className="quick-action-label">{t("dashboard.viewProperties")}</span>
            </Link>
            <Link href="/dashboard/properties" className="quick-action-btn">
              <span className="icon purple"><FileText size={22} /></span>
              <span className="quick-action-label">{t("dashboard.manageFiles")}</span>
            </Link>
          </div>
        </Card>
      </div>

      <Card variant="intense" className="section-panel">
        <div className="section-header">
          <div className="section-title"><Building2 size={18} style={{ display: "inline", marginRight: 6, verticalAlign: -3 }} />{t("dashboard.recentProperties")}</div>
          <Link href="/dashboard/properties">
            <Badge color="blue">{t("dashboard.viewAll")} →</Badge>
          </Link>
        </div>
        {recentProperties.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--text-secondary)" }}>
            <p style={{ marginBottom: 16 }}>{t("dashboard.noProperties")}</p>
            <Link href="/dashboard/properties/new">
              <Badge color="blue">+ {t("dashboard.addFirstProperty")}</Badge>
            </Link>
          </div>
        ) : (
          <div className="content-grid-2">
            {recentProperties.map((p: Record<string, unknown>) => (
              <Link key={String(p.id)} href={`/dashboard/properties/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <PropertyCard
                  name={String(p.name ?? "")}
                  address={[p.city, p.state].filter(Boolean).join(", ") || String(p.address ?? "")}
                  badge={
                    <Badge color={p.status === "rented" ? "green" : p.status === "vacant" ? "amber" : "blue"}>
                      {p.status === "rented" ? t("status.rented") : p.status === "vacant" ? t("status.vacant") : t("status.occupied")}
                    </Badge>
                  }
                  finance={[
                    { label: t("property.valuation"), value: formatCurrency(Number(p.current_value) || 0) },
                    ...(p.status === "rented"
                      ? [{ label: t("property.monthlyRent"), value: formatCurrency(0) }]
                      : [{ label: t("property.loanBalance"), value: formatCurrency(Number(p.loan_balance) || 0) }]),
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
