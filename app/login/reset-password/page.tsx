"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { showToast } from "@/components/ui/Toast";
import { updatePassword } from "@/lib/auth/actions";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);

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
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>重置密码</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            请输入您的新密码
          </p>
        </div>

        <form action={formAction}>
          <FormInput
            label="新密码"
            name="password"
            type="password"
            placeholder="至少8位字符，需包含字母和数字"
            required
          />
          <Button type="submit" disabled={isPending} style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
            {isPending ? "更新中..." : "更新密码"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
