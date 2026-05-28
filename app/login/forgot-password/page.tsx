"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { showToast } from "@/components/ui/Toast";
import { resetPassword } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPassword, null);

  useEffect(() => {
    if (state?.error) {
      showToast(state.error, "error");
    }
    if (state?.success) {
      showToast(state.success, "success");
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
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔑</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>忘记密码</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            输入您的注册邮箱，我们将发送密码重置链接
          </p>
        </div>

        <form action={formAction}>
          <FormInput
            label="邮箱地址"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
          />
          <Button type="submit" disabled={isPending} style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
            {isPending ? "发送中..." : "发送重置链接"}
          </Button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 14,
            color: "var(--text-secondary)",
          }}
        >
          <Link href="/login" style={{ color: "var(--brand)", fontWeight: 600 }}>
            返回登录
          </Link>
        </p>
      </Card>
    </div>
  );
}
