import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { signOut } from "@/lib/auth/actions";
import { updateProfile } from "@/lib/api/profiles";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, language")
    .eq("id", user?.id ?? "")
    .single();

  const displayName = profile?.display_name || user?.user_metadata?.full_name || "";
  const savedLang = profile?.language || "zh";

  async function handleSave(formData: FormData) {
    "use server";
    const lang = (formData.get("language") as string) || "zh";
    await updateProfile(formData);
    (await cookies()).set("NEXT_LOCALE", lang, { path: "/", maxAge: 31536000 });
    redirect("/dashboard");
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">⚙️ {t("settings.title")}</div>
          <div className="page-subtitle">{t("settings.subtitle")}</div>
        </div>
      </div>

      <div className="content-grid-2">
        <Card variant="intense" className="section-panel">
          <div className="section-title" style={{ marginBottom: 20 }}>👤 {t("settings.profile")}</div>
          <form action={handleSave}>
            <FormInput label={t("settings.email")} name="email" type="email" defaultValue={user?.email ?? ""} disabled />
            <FormInput label={t("settings.displayName")} name="display_name" placeholder={t("settings.displayNamePlaceholder")} defaultValue={displayName} />
            <div className="form-group">
              <label className="form-label">{t("settings.language")}</label>
              <select className="form-input" name="language" defaultValue={savedLang}>
                <option value="zh">中文</option>
                <option value="en">English</option>
                <option value="ms">Bahasa Melayu</option>
              </select>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{t("settings.languageNote")}</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <Button variant="primary" type="submit">{t("settings.save")}</Button>
            </div>
          </form>
        </Card>

        <Card variant="intense" className="section-panel">
          <div className="section-title" style={{ marginBottom: 20 }}>🎨 {t("settings.appearance")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{t("settings.darkMode")}</span>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{t("settings.darkModeNote")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{t("settings.currency")}</span>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>MYR (RM)</span>
            </div>
          </div>
        </Card>
      </div>

      <Card variant="intense" className="section-panel" style={{ marginTop: 24 }}>
        <div className="section-title" style={{ marginBottom: 20 }}>🔐 {t("settings.account")}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 600 }}>{t("settings.logout")}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{t("settings.logoutNote")}</div>
          </div>
          <form action={signOut}>
            <Button variant="danger" size="sm" type="submit">{t("settings.logoutButton")}</Button>
          </form>
        </div>
      </Card>
    </>
  );
}
