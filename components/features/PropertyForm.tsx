"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { showToast } from "@/components/ui/Toast";
import { createPropertyAction } from "@/app/dashboard/properties/new/actions";
import { updatePropertyAction } from "@/app/dashboard/properties/[id]/edit/actions";
import type { Property } from "@/types/database";

interface Props {
  property?: Property;
  mode: "new" | "edit";
}

export function PropertyForm({ property, mode }: Props) {
  const serverAction = mode === "new" ? createPropertyAction : updatePropertyAction.bind(null, property?.id ?? "");
  const [state, formAction, isPending] = useActionState(serverAction, null);

  useEffect(() => {
    if (state?.error) {
      showToast(state.error, "error");
    }
  }, [state]);

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/properties">房产列表</Link>
        <span>›</span>
        {mode === "edit" && property ? (
          <>
            <Link href={"/dashboard/properties/" + property.id}>{property.name}</Link>
            <span>›</span>
          </>
        ) : null}
        <span className="current">{mode === "new" ? "新增房产" : "编辑"}</span>
      </div>

      <div className="page-header">
        <div>
          <div className="page-title">{mode === "new" ? "🏠 新增房产" : "✏️ 编辑房产"}</div>
          <div className="page-subtitle">
            {mode === "new" ? "填写房产信息，支持地图定位选点" : property?.name}
          </div>
        </div>
      </div>

      <form action={formAction}>
        <div className="content-grid-2" style={{ marginBottom: 28 }}>
          <Card variant="intense" className="section-panel">
            <div className="section-title" style={{ marginBottom: 20 }}>📋 基本信息</div>
            <FormInput
              label="房产名称" name="name" placeholder="例如：SkyVue 高级公寓"
              defaultValue={property?.name ?? ""} required
            />
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">房产类型</label>
                <select className="form-input" name="property_type" defaultValue={property?.property_type ?? "apartment"}>
                  <option value="apartment">公寓</option>
                  <option value="landed">有地房产</option>
                  <option value="land">土地</option>
                  <option value="shop">商铺</option>
                  <option value="factory">工厂</option>
                </select>
              </div>
              <FormInput
                label="地契编号" name="title_deed_no" placeholder="HS(D) 12345/2020"
                defaultValue={property?.title_deed_no ?? ""}
              />
            </div>
            <div className="form-row">
              <FormInput label="城市" name="city" placeholder="Kuala Lumpur" defaultValue={property?.city ?? ""} />
              <FormInput label="州属" name="state" placeholder="Selangor" defaultValue={property?.state ?? ""} />
            </div>
            <FormInput
              label="详细地址" name="address" placeholder="Jalan, Taman, Poskod"
              defaultValue={property?.address ?? ""}
            />
            <FormInput
              label="邮编号码" name="postcode" placeholder="47300"
              defaultValue={property?.postcode ?? ""}
            />
          </Card>

          <Card variant="intense" className="section-panel">
            <div className="section-title" style={{ marginBottom: 20 }}>📍 地图定位</div>
            <MapPlaceholder />
          </Card>
        </div>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>💰 财务信息</div>
          <div className="form-row-3">
            <FormInput
              label="购买价格" name="purchase_price" type="number" placeholder="0.00"
              defaultValue={property?.purchase_price ? String(property.purchase_price) : ""}
            />
            <FormInput
              label="当前估值" name="current_value" type="number" placeholder="0.00"
              defaultValue={property?.current_value ? String(property.current_value) : ""}
            />
            <FormInput
              label="贷款余额" name="loan_balance" type="number" placeholder="0.00"
              defaultValue={property?.loan_balance ? String(property.loan_balance) : ""}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <FormInput
              label="贷款银行" name="loan_bank" placeholder="例如：Maybank"
              defaultValue={property?.loan_bank ?? ""}
            />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>📄 法律文件</div>
          <FormInput label="SPA 买卖合同链接" name="spa_file_url" placeholder="上传SPA文件后粘贴链接" defaultValue={property?.spa_file_url ?? ""} />
          <FormInput label="地契/Geran 文件链接" name="geran_file_url" placeholder="上传地契后粘贴链接" defaultValue={property?.geran_file_url ?? ""} />
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>📊 状态</div>
          <div className="form-group">
            <select className="form-input" name="status" defaultValue={property?.status ?? "vacant"}>
              <option value="rented">出租中</option>
              <option value="non_rental">自住</option>
              <option value="vacant">空置</option>
              <option value="sold">已售</option>
            </select>
          </div>
        </Card>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link href={property ? "/dashboard/properties/" + property.id : "/dashboard/properties"}>
            <Button variant="secondary">取消</Button>
          </Link>
          <Button variant="primary" type="submit" disabled={isPending}>
            {isPending ? "保存中..." : mode === "new" ? "保存房产" : "保存更改"}
          </Button>
        </div>
      </form>
    </>
  );
}
