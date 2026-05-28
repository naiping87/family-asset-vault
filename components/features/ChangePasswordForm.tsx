"use client";

import { useActionState, useEffect } from "react";
import { useT } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { showToast } from "@/components/ui/Toast";
import { changePassword } from "@/lib/auth/actions";

export function ChangePasswordForm() {
  const { t } = useT();
  const [state, formAction, isPending] = useActionState(changePassword, null);

  useEffect(() => {
    if (state?.error) showToast(state.error, "error");
    if (state?.success) showToast(state.success, "success");
  }, [state]);

  return (
    <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--glass-border)" }}>
      <div style={{ fontWeight: 600, marginBottom: 16 }}>🔒 {t("settings.changePassword")}</div>
      <form action={formAction}>
        <FormInput label={t("settings.currentPassword")} name="current_password" type="password" placeholder="••••••••" required />
        <FormInput label={t("settings.newPassword")} name="new_password" type="password" placeholder={t("auth.passwordHint")} required />
        <Button variant="primary" size="sm" type="submit" disabled={isPending}>
          {isPending ? t("common.saving") : t("settings.updatePassword")}
        </Button>
      </form>
    </div>
  );
}
