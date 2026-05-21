"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";

export default function NewPropertyPage() {
  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/properties">房产列表</Link>
        <span>›</span>
        <span className="current">新增房产</span>
      </div>

      <div className="page-header">
        <div>
          <div className="page-title">🏠 新增房产</div>
          <div className="page-subtitle">填写房产信息，支持地图定位选点</div>
        </div>
      </div>

      <div className="content-grid-2" style={{ marginBottom: 28 }}>
        <Card variant="intense" className="section-panel">
          <div className="section-title" style={{ marginBottom: 20 }}>📋 基本信息</div>
          <FormInput label="房产名称" placeholder="例如：SkyVue 高级公寓" />
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">房产类型</label>
              <select className="form-input">
                <option>公寓</option>
                <option>有地房产</option>
                <option>土地</option>
                <option>商铺</option>
                <option>工厂</option>
              </select>
            </div>
            <FormInput label="地契编号" placeholder="HS(D) 12345/2020" />
          </div>
          <div className="form-row">
            <FormInput label="城市" placeholder="Kuala Lumpur" />
            <FormInput label="州属" placeholder="Selangor" />
          </div>
          <FormInput label="详细地址" placeholder="Jalan, Taman, Poskod" />
        </Card>

        <Card variant="intense" className="section-panel">
          <div className="section-title" style={{ marginBottom: 20 }}>📍 地图定位</div>
          <MapPlaceholder />
        </Card>
      </div>

      <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
        <div className="section-title" style={{ marginBottom: 20 }}>💰 财务信息</div>
        <div className="form-row-3">
          <div className="form-input-wrapper">
            <span className="form-prefix">RM</span>
            <input className="form-input" placeholder="0.00" />
          </div>
          <div className="form-input-wrapper">
            <span className="form-prefix">RM</span>
            <input className="form-input" placeholder="0.00" />
          </div>
          <div className="form-input-wrapper">
            <span className="form-prefix">RM</span>
            <input className="form-input" placeholder="0.00" />
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
          购买价格 · 当前估值 · 贷款余额
        </div>
      </Card>

      <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
        <div className="section-header">
          <div className="section-title">👥 共同持有人</div>
          <Button variant="secondary" size="sm">+ 添加持有人</Button>
        </div>
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
          <button className="owner-remove">✕</button>
        </div>
      </Card>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <Link href="/dashboard/properties">
          <Button variant="secondary">取消</Button>
        </Link>
        <Button variant="primary">保存房产</Button>
      </div>
    </>
  );
}
