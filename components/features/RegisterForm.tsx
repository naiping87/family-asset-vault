"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { showToast } from "@/components/ui/Toast";
import { signUp } from "@/lib/auth/actions";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signUp, null);

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
            style={{ margin: "0 auto 16px", width: 56, height: 56, fontSize: 28 }}
          >
            🏰
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>注册账号</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            创建您的家庭资产管理账户
          </p>
        </div>

        <form action={formAction}>
          <FormInput
            label="姓名"
            name="full_name"
            type="text"
            placeholder="您的名字"
            required
          />
          <FormInput
            label="邮箱地址"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
          />
          <FormInput
            label="密码"
            name="password"
            type="password"
            placeholder="至少6位字符"
            required
          />

          <Button type="submit" disabled={isPending} style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
            {isPending ? "注册中..." : "注 册"}
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
          已有账号？
          <Link href="/login" style={{ color: "var(--brand)", fontWeight: 600, marginLeft: 4 }}>
            立即登录
          </Link>
        </p>
      </Card>
    </div>
  );
}
