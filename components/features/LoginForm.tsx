"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/provider";
import { Icon } from "@/lib/utils/icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { showToast } from "@/components/ui/Toast";
import { signIn } from "@/lib/auth/actions";

export function LoginForm() {
  const { t } = useT();
  const [state, formAction, isPending] = useActionState(signIn, null);

  useEffect(() => {
    if (state?.error) {
      showToast(state.error, "error");
    }
  }, [state]);

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
          <div
            className="logo-icon"
            style={{ margin: "0 auto 16px", width: 56, height: 56 }}
          >
            <Icon name="Landmark" size={28} style={{ color: "white" }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
            {t("auth.title")}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            {t("auth.subtitle")}
          </p>
        </div>

        <form action={formAction}>
          <FormInput
            label={t("auth.email")}
            name="email"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            required
          />
          <FormInput
            label={t("auth.password")}
            name="password"
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            required
          />

          <div style={{ textAlign: "right", marginTop: -8, marginBottom: 8 }}>
            <Link href="/login/forgot-password" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {t("auth.forgotPassword")}
            </Link>
          </div>

          <Button type="submit" disabled={isPending} style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
            {isPending ? t("auth.loggingIn") : t("auth.login")}
          </Button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
          {t("auth.noAccount")}
          <Link href="/register" style={{ color: "var(--brand)", fontWeight: 600, marginLeft: 4 }}>
            {t("auth.registerNow")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
