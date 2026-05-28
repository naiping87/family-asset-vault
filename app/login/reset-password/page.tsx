"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { showToast } from "@/components/ui/Toast";
import { updatePassword } from "@/lib/auth/actions";

export default function ResetPasswordPage() {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState(updatePassword, null);

  useEffect(() => {
    if (state?.error) showToast(state.error, "error");
  }, [state]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 16 }}>
      <Card variant="intense" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{t("auth.resetTitle")}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>{t("auth.resetDesc")}</p>
        </div>
        <form action={formAction}>
          <FormInput label={t("auth.password")} name="password" type="password" placeholder={t("auth.passwordHint")} required />
          <Button type="submit" disabled={isPending} style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
            {isPending ? t("auth.updating") : t("auth.updatePassword")}
          </Button>
        </form>
      </Card>
    </div>
  );
}
