import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { signOut } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">⚙️ 设置</div>
          <div className="page-subtitle">管理您的账户和个人偏好</div>
        </div>
      </div>

      <div className="content-grid-2">
        <Card variant="intense" className="section-panel">
          <div className="section-title" style={{ marginBottom: 20 }}>👤 个人资料</div>
          <form>
            <FormInput
              label="邮箱"
              name="email"
              type="email"
              defaultValue={user?.email ?? ""}
              disabled
            />
            <FormInput
              label="显示名称"
              name="display_name"
              placeholder="您的显示名称"
              defaultValue={user?.user_metadata?.full_name ?? ""}
            />
            <div style={{ marginTop: 16 }}>
              <Button variant="primary" type="submit">保存更改</Button>
            </div>
          </form>
        </Card>

        <Card variant="intense" className="section-panel">
          <div className="section-title" style={{ marginBottom: 20 }}>🎨 外观</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>夜间模式</span>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>通过顶部切换</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>语言</span>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>中文</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>货币单位</span>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>MYR (RM)</span>
            </div>
          </div>
        </Card>
      </div>

      <Card variant="intense" className="section-panel" style={{ marginTop: 24 }}>
        <div className="section-title" style={{ marginBottom: 20 }}>🔐 账户操作</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600 }}>退出登录</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>安全退出当前账户</div>
            </div>
            <form action={signOut}>
              <Button variant="danger" size="sm" type="submit">退出</Button>
            </form>
          </div>
        </div>
      </Card>
    </>
  );
}
