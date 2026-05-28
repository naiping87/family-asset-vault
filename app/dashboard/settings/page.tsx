import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { signOut } from "@/lib/auth/actions";
import { updateProfile } from "@/lib/api/profiles";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile for display name and language
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, language")
    .eq("id", user?.id ?? "")
    .single();

  const displayName = profile?.display_name || user?.user_metadata?.full_name || "";
  const savedLang = profile?.language || "zh";

  async function handleSave(formData: FormData) {
    "use server";
    await updateProfile(formData);
    redirect("/dashboard");  // redirect forces layout to re-fetch user data
  }

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
          <form action={handleSave}>
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
              defaultValue={displayName}
            />
            <div className="form-group">
              <label className="form-label">语言</label>
              <select className="form-input" name="language" defaultValue={savedLang}>
                <option value="zh">中文</option>
                <option value="en">English</option>
                <option value="ms">Bahasa Melayu</option>
              </select>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                语言偏好已保存。全站多语言翻译即将上线。
              </div>
            </div>
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
