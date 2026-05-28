"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { showToast } from "@/components/ui/Toast";
import { resetPassword } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  const { t } = useT();
  const [state, formAction, isPending] = useActionState(resetPassword, null);

  useEffect(() => {
    if (state?.error) showToast(state.error, "error");
    if (state?.success) showToast(state.success, "success");
  }, [state]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 16 }}>
      <Card variant="intense" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔑</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{t("auth.forgotTitle")}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>{t("auth.forgotDesc")}</p>
        </div>
        <form action={formAction}>
          <FormInput label={t("auth.email")} name="email" type="email" placeholder={t("auth.emailPlaceholder")} required />
          <Button type="submit" disabled={isPending} style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
            {isPending ? t("auth.sending") : t("auth.sendResetLink")}
          </Button>
        </form>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
          <Link href="/login" style={{ color: "var(--brand)", fontWeight: 600 }}>{t("auth.backToLogin")}</Link>
        </p>
      </Card>
    </div>
  );
}
