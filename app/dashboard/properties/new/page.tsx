import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { createProperty } from "@/lib/api/properties";
import { redirect } from "next/navigation";

export default function NewPropertyPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await createProperty(formData);
    if (result.error) return;
    redirect("/dashboard/properties");
  }

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

      <form action={handleSubmit}>
        <div className="content-grid-2" style={{ marginBottom: 28 }}>
          <Card variant="intense" className="section-panel">
            <div className="section-title" style={{ marginBottom: 20 }}>📋 基本信息</div>
            <FormInput label="房产名称" name="name" placeholder="例如：SkyVue 高级公寓" required />
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">房产类型</label>
                <select className="form-input" name="property_type" defaultValue="apartment">
                  <option value="apartment">公寓</option>
                  <option value="landed">有地房产</option>
                  <option value="land">土地</option>
                  <option value="shop">商铺</option>
                  <option value="factory">工厂</option>
                </select>
              </div>
              <FormInput label="地契编号" name="title_deed_no" placeholder="HS(D) 12345/2020" />
            </div>
            <div className="form-row">
              <FormInput label="城市" name="city" placeholder="Kuala Lumpur" />
              <FormInput label="州属" name="state" placeholder="Selangor" />
            </div>
            <FormInput label="详细地址" name="address" placeholder="Jalan, Taman, Poskod" />
            <FormInput label="邮编号码" name="postcode" placeholder="47300" />
          </Card>

          <Card variant="intense" className="section-panel">
            <div className="section-title" style={{ marginBottom: 20 }}>📍 地图定位</div>
            <MapPlaceholder />
          </Card>
        </div>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>💰 财务信息</div>
          <div className="form-row-3">
            <FormInput label="购买价格" name="purchase_price" type="number" placeholder="0.00" />
            <FormInput label="当前估值" name="current_value" type="number" placeholder="0.00" />
            <FormInput label="贷款余额" name="loan_balance" type="number" placeholder="0.00" />
          </div>
          <div style={{ marginTop: 16 }}>
            <FormInput label="贷款银行" name="loan_bank" placeholder="例如：Maybank" />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>📄 法律文件</div>
          <FormInput label="SPA 买卖合同链接" name="spa_file_url" placeholder="上传SPA文件后粘贴链接" />
          <FormInput label="地契/Geran 文件链接" name="geran_file_url" placeholder="上传地契后粘贴链接" />
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>📊 状态</div>
          <div className="form-group">
            <select className="form-input" name="status" defaultValue="vacant">
              <option value="rented">出租中</option>
              <option value="non_rental">自住</option>
              <option value="vacant">空置</option>
              <option value="sold">已售</option>
            </select>
          </div>
        </Card>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link href="/dashboard/properties">
            <Button variant="secondary">取消</Button>
          </Link>
          <Button variant="primary" type="submit">保存房产</Button>
        </div>
      </form>
    </>
  );
}
