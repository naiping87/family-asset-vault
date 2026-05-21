"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { UploadZone } from "@/components/ui/UploadZone";
import { DataTable } from "@/components/ui/DataTable";

const tabs = [
  { key: "overview", label: "概览" },
  { key: "tenancy", label: "租约" },
  { key: "tax", label: "税务" },
  { key: "insurance", label: "保险" },
  { key: "files", label: "文件" },
];

const taxColumns = [
  { key: "type", label: "税种" },
  { key: "authority", label: "机构" },
  { key: "account", label: "账号" },
  { key: "amount", label: "金额" },
  { key: "due", label: "截止日期" },
  { key: "status", label: "状态", render: (value: unknown) => {
    const status = value as string;
    const colors: Record<string, string> = { paid: "green", unpaid: "amber", overdue: "red" };
    const labels: Record<string, string> = { paid: "已缴", unpaid: "未缴", overdue: "逾期" };
    return <Badge color={colors[status] as "green" | "amber" | "red"}>{labels[status]}</Badge>;
  } },
];

const taxData = [
  { type: "门牌税", authority: "DBKL", account: "A-2024-00123", amount: "RM 1,200", due: "2026-06-30", status: "unpaid" },
  { type: "土地税", authority: "MBPJ", account: "L-2024-00456", amount: "RM 850", due: "2026-08-15", status: "paid" },
];

export default function PropertyDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <Breadcrumb
        items={[
          { label: "房产列表", href: "/dashboard/properties" },
          { label: "SkyVue 高级公寓" },
        ]}
      />

      <div className="detail-header glass-intense">
        <div className="detail-title-area">
          <div className="detail-title">SkyVue 高级公寓</div>
          <div className="detail-meta">
            <Badge color="green">出租中</Badge>
            <Badge color="blue">公寓</Badge>
          </div>
          <div className="detail-address">📍 Jalan SkyVue, Kuala Lumpur</div>
        </div>
        <div className="detail-actions">
          <Button variant="secondary" size="sm">编辑</Button>
          <Button variant="danger" size="sm">删除</Button>
        </div>
        <div className="detail-stats">
          <div className="detail-stat">
            <div className="detail-stat-label">估值</div>
            <div className="detail-stat-value">RM 850K</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">购买价格</div>
            <div className="detail-stat-value">RM 680K</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">贷款余额</div>
            <div className="detail-stat-value">RM 250K</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">月租收入</div>
            <div className="detail-stat-value">RM 3,500</div>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="content-grid-2">
          <Card variant="intense" className="section-panel">
            <div className="section-title" style={{ marginBottom: 16 }}>🏠 房产信息</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><span style={{ color: "var(--text-secondary)", fontSize: 14 }}>类型: </span>公寓</div>
              <div><span style={{ color: "var(--text-secondary)", fontSize: 14 }}>地契: </span>HS(D) 12345/2020</div>
              <div><span style={{ color: "var(--text-secondary)", fontSize: 14 }}>地址: </span>Jalan SkyVue, Kuala Lumpur</div>
            </div>
          </Card>
          <Card variant="intense" className="section-panel">
            <div className="section-title" style={{ marginBottom: 16 }}>👥 持有人</div>
            <div className="owner-item">
              <div className="owner-avatar" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>张</div>
              <div className="owner-info">
                <div className="owner-name">张先生</div>
                <div className="owner-role">主要持有人</div>
              </div>
              <div className="owner-pct">50%</div>
            </div>
            <div className="owner-item">
              <div className="owner-avatar" style={{ background: "linear-gradient(135deg, #ec4899, #f472b6)" }}>太</div>
              <div className="owner-info">
                <div className="owner-name">张太太</div>
                <div className="owner-role">共同持有人</div>
              </div>
              <div className="owner-pct">50%</div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "tenancy" && (
        <Card variant="intense" className="tenancy-card">
          <div className="tenancy-header">
            <div>
              <span style={{ fontWeight: 700, fontSize: 17, marginRight: 8 }}>陈小明</span>
              <Badge color="green">活跃</Badge>
            </div>
            <Button variant="secondary" size="sm">编辑租约</Button>
          </div>
          <div className="tenancy-body">
            <div className="tenancy-field">
              <div className="tenancy-field-label">开始日期</div>
              <div className="tenancy-field-value">2025-01-01</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">结束日期</div>
              <div className="tenancy-field-value">2026-12-31</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">月租</div>
              <div className="tenancy-field-value">RM 3,500</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">押金</div>
              <div className="tenancy-field-value">RM 7,000</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">电话</div>
              <div className="tenancy-field-value">012-345 6789</div>
            </div>
            <div className="tenancy-field">
              <div className="tenancy-field-label">IC 号码</div>
              <div className="tenancy-field-value">900101-10-1234</div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "tax" && (
        <Card variant="intense" className="section-panel">
          <div className="section-header">
            <div className="section-title">📋 税务记录</div>
            <Button variant="secondary" size="sm">+ 添加税务记录</Button>
          </div>
          <DataTable columns={taxColumns} data={taxData} />
        </Card>
      )}

      {activeTab === "insurance" && (
        <Card variant="intense" className="section-panel">
          <div className="section-header">
            <div className="section-title">🛡️ 关联保单</div>
            <Link href="/dashboard/insurances">
              <Button variant="secondary" size="sm">查看全部</Button>
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="glass" style={{ padding: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>🔥 火险 · Allianz · FL-2026-001</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>保额 RM 500K · 年费 RM 1,200</div>
            </div>
            <div className="glass" style={{ padding: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>🏠 房屋保险 · Etiqa · HI-2025-045</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>保额 RM 200K · 年费 RM 850</div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "files" && (
        <Card variant="intense" className="section-panel">
          <div className="section-title" style={{ marginBottom: 20 }}>📁 文件管理</div>
          <UploadZone />
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="glass" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <span>📄</span>
              <span style={{ flex: 1, fontSize: 14 }}>地契副本.pdf</span>
              <Badge color="gray">2024-03-15</Badge>
            </div>
            <div className="glass" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <span>📄</span>
              <span style={{ flex: 1, fontSize: 14 }}>购买合同.pdf</span>
              <Badge color="gray">2023-01-10</Badge>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
