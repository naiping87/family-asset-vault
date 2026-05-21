"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FilterPills } from "@/components/ui/FilterPills";
import { PropertyCard } from "@/components/ui/PropertyCard";

const filters = [
  { key: "all", label: "全部", count: 4 },
  { key: "vacant", label: "自住" },
  { key: "rented", label: "出租中" },
  { key: "non_rental", label: "空置" },
];

export default function PropertiesPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🏘️ 我的房产</div>
          <div className="page-subtitle">共 4 处房产 · 总估值 RM 2.85M</div>
        </div>
        <Link href="/dashboard/properties/new">
          <Button variant="primary">+ 添加房产</Button>
        </Link>
      </div>

      <FilterPills
        pills={filters}
        activeKey={activeFilter}
        onChange={setActiveFilter}
      />

      <div className="content-grid-3">
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

        <Link href="/dashboard/properties/kampung" style={{ textDecoration: "none", color: "inherit" }}>
          <PropertyCard
            name="Kampung 村屋"
            address="Kampung Baru, Pahang"
            badge={<Badge color="gray">空置</Badge>}
            finance={[
              { label: "估值", value: "RM 300K" },
              { label: "土地面积", value: "5,000 sqft" },
            ]}
          />
        </Link>

        <Link href="/dashboard/properties/seksyen51" style={{ textDecoration: "none", color: "inherit" }}>
          <PropertyCard
            name="Seksyen 51 商铺"
            address="Jalan 51/205, Petaling Jaya"
            badge={<Badge color="green">出租中</Badge>}
            finance={[
              { label: "估值", value: "RM 500K" },
              { label: "月租", value: "RM 5,000" },
            ]}
          />
        </Link>
      </div>
    </>
  );
}
