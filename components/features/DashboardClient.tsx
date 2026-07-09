"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useT } from "@/lib/i18n/provider";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { formatCurrency } from "@/lib/utils/formatters";
import { LayoutDashboard, Building2, Wallet, Shield, FileText, Clock, List } from "lucide-react";
import type { ReactNode } from "react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

function Animate({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show" transition={{ delay }}>
      {children}
    </motion.div>
  );
}

interface Props {
  greeting: string;
  displayName: string;
  today: string;
  stats: Record<string, unknown> | null;
  reminders: Record<string, unknown>[];
  recentProperties: Record<string, unknown>[];
}

export function DashboardClient({ greeting, displayName, today, stats, reminders, recentProperties }: Props) {
  const { t } = useT();
  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <Animate>
        <div className="greeting">
          <div className="greeting-text">{greeting}，{displayName}</div>
          <div className="greeting-date">{today}</div>
        </div>
      </Animate>

      <Animate delay={0.05}>
        <div className="stats-grid">
          <StatsCard icon={<LayoutDashboard size={22} />} iconColor="blue"
            label={t("dashboard.totalValue")}
            value={stats ? formatCurrency(Number(stats.total_value) || 0) : "RM 0"}
            sub={stats ? `${stats.total_properties} ${t("dashboard.propertiesUnit")}` : t("common.noData")} />
          <StatsCard icon={<Building2 size={22} />} iconColor="green"
            label={t("dashboard.propertyCount")}
            value={stats ? String(stats.total_properties) : "0"}
            sub={stats ? `${stats.rented_count} ${t("dashboard.rentedCount")} · ${stats.non_rental_count} ${t("dashboard.occupiedCount")} · ${stats.vacant_count} ${t("dashboard.vacantCount")}` : t("common.noData")} />
          <StatsCard icon={<Wallet size={22} />} iconColor="amber"
            label={t("dashboard.monthlyRental")}
            value={stats ? formatCurrency(Number(stats.monthly_rental_income) || 0) : "RM 0"}
            sub={stats ? `${t("dashboard.annualRental")} ${formatCurrency(Number(stats.monthly_rental_income || 0) * 12)}` : t("common.noData")} />
          <StatsCard icon={<Shield size={22} />} iconColor="purple"
            label={t("dashboard.insuranceCount")}
            value={stats ? String(stats.active_insurances) : "0"}
            sub={stats && Number(stats.active_insurances) > 0 ? t("dashboard.manageInsurance") : t("common.noData")} />
        </div>
      </Animate>

      <Animate delay={0.1}>
        <div className="content-grid-2">
          <Card variant="intense" className="section-panel">
            <div className="section-header">
              <div className="section-title"><Clock size={16} style={{ display: "inline", marginRight: 6, verticalAlign: -2 }} />{t("dashboard.reminders")}</div>
            </div>
            {reminders.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--text-secondary)" }}>{t("dashboard.noReminders")}</div>
            ) : (
              <div className="reminder-list">
                {reminders.map((r, i) => (
                  <div className="reminder-item" key={i}>
                    <div className={`reminder-dot ${r.type}`} />
                    <div className="reminder-info">
                      <div className="reminder-title">{String(r.title)}</div>
                      <div className="reminder-sub">{String(r.sub)}</div>
                    </div>
                    <span className={`reminder-days ${r.type}`}>
                      {Number(r.days) < 0 ? `已过期 ${Math.abs(Number(r.days))} 天` : `${r.days} 天`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card variant="intense" className="section-panel">
            <div className="section-header">
              <div className="section-title">{t("dashboard.quickActions")}</div>
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
      </Animate>

      <Animate delay={0.15}>
        <Card variant="intense" className="section-panel">
          <div className="section-header">
            <div className="section-title"><Building2 size={16} style={{ display: "inline", marginRight: 6, verticalAlign: -2 }} />{t("dashboard.recentProperties")}</div>
            <Link href="/dashboard/properties"><Badge color="blue">{t("dashboard.viewAll")} →</Badge></Link>
          </div>
          {recentProperties.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-secondary)" }}>
              <p style={{ marginBottom: 16 }}>{t("dashboard.noProperties")}</p>
              <Link href="/dashboard/properties/new"><Badge color="blue">+ {t("dashboard.addFirstProperty")}</Badge></Link>
            </div>
          ) : (
            <div className="content-grid-2">
              {recentProperties.map((p) => (
                <Link key={String(p.id)} href={`/dashboard/properties/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <PropertyCard
                    name={String(p.name ?? "")}
                    address={[p.city, p.state].filter(Boolean).join(", ") || String(p.address ?? "")}
                    badge={<Badge color={p.status === "rented" ? "green" : p.status === "vacant" ? "amber" : "blue"}>{p.status === "rented" ? t("status.rented") : p.status === "vacant" ? t("status.vacant") : t("status.occupied")}</Badge>}
                    finance={[
                      { label: t("property.valuation"), value: formatCurrency(Number(p.current_value) || 0) },
                      ...(p.status === "rented"
                      ? [{ label: t("property.monthlyRent"), value: formatCurrency((() => { const tenancies = (p as any).tenancies; const active = tenancies?.find((t: any) => t.status === "active"); return Number(active?.monthly_rent) || 0; })()) }]
                      : [{ label: t("property.loanBalance"), value: formatCurrency(Number(p.loan_balance) || 0) }]),
                    ]}
                  />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </Animate>
    </motion.div>
  );
}
