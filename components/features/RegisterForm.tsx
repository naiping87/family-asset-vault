"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { showToast } from "@/components/ui/Toast";
import { signUp } from "@/lib/auth/actions";
import { passwordStrength } from "@/lib/auth/validation";

export function RegisterForm() {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState(signUp, null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (state?.error) {
      showToast(state.error, "error");
    }
  }, [state]);

  const strength = password ? passwordStrength(password) : null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 16,
      }}
    >
      <Card variant="intense" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="logo-icon" style={{ margin: "0 auto 16px", width: 56, height: 56, fontSize: 28 }}>🏰</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{t("auth.registerAccount")}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>{t("auth.registerDesc")}</p>
        </div>

        <form action={formAction}>
          <FormInput label={t("auth.name")} name="full_name" type="text" placeholder={t("auth.fullNamePlaceholder")} required />
          <FormInput label={t("auth.email")} name="email" type="email" placeholder={t("auth.emailPlaceholder")} required />
          <FormInput
            label={t("auth.password")} name="password" type="password"
            placeholder={t("auth.passwordHint")} required
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          {strength && (
            <div style={{ marginTop: -8, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength.score ? strength.color : "var(--glass-border)", transition: "background 0.2s" }} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: strength.color, marginTop: 4, display: "inline-block" }}>
                {t("auth.passwordStrength")}: {t(strength.label === "弱" ? "auth.passwordWeak" : strength.label === "中等" ? "auth.passwordMedium" : "auth.passwordStrong")}
              </span>
            </div>
          )}

          <Button type="submit" disabled={isPending} style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
            {isPending ? t("auth.registering") : t("auth.register")}
          </Button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
          {t("auth.hasAccount")}
          <Link href="/login" style={{ color: "var(--brand)", fontWeight: 600, marginLeft: 4 }}>{t("auth.loginNow")}</Link>
        </p>
      </Card>
    </div>
  );
}
