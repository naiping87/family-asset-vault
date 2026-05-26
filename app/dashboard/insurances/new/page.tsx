import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { createInsurance } from "@/lib/api/insurances";
import { getProperties } from "@/lib/api/properties";
import { redirect } from "next/navigation";

export default async function NewInsurancePage() {
  const properties = await getProperties();

  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await createInsurance(formData);
    if (result.error) return;
    redirect("/dashboard/insurances");
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/insurances">保险列表</Link>
        <span>›</span>
        <span className="current">新增保险</span>
      </div>

      <div className="page-header">
        <div>
          <div className="page-title">🛡️ 新增保险</div>
          <div className="page-subtitle">记录保单信息，到期自动提醒</div>
        </div>
      </div>

      <form action={handleSubmit}>
        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>📋 保单信息</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">保险类型</label>
              <select className="form-input" name="insurance_type" defaultValue="fire" required>
                <option value="fire">火险</option>
                <option value="flood">水灾险</option>
                <option value="home">房屋保险</option>
                <option value="mortgage">贷款保险</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">关联房产</label>
              <select className="form-input" name="property_id" defaultValue="">
                <option value="">不关联</option>
                {properties.map((p: { id: string; name: string }) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <FormInput label="保险公司" name="provider" placeholder="例如：Allianz" required />
            <FormInput label="保单编号" name="policy_no" placeholder="例如：FL-2026-001" required />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>💰 保额与保费</div>
          <div className="form-row">
            <FormInput label="保额 (RM)" name="coverage_amount" type="number" placeholder="0.00" required />
            <FormInput label="年费 (RM)" name="annual_premium" type="number" placeholder="0.00" required />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>👤 保险代理人</div>
          <div className="form-row">
            <FormInput label="代理人姓名" name="agent_name" placeholder="例如：陈先生" />
            <FormInput label="代理人电话" name="agent_phone" placeholder="例如：012-3456789" />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>📅 有效期限</div>
          <div className="form-row">
            <FormInput label="开始日期" name="start_date" type="date" required />
            <FormInput label="结束日期" name="end_date" type="date" required />
          </div>
        </Card>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link href="/dashboard/insurances">
            <Button variant="secondary">取消</Button>
          </Link>
          <Button variant="primary" type="submit">保存保单</Button>
        </div>
      </form>
    </>
  );
}
