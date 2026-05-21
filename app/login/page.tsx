import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";

export default function LoginPage() {
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
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
            Family Asset Vault
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            家庭资产保险箱
          </p>
        </div>

        <form>
          <FormInput
            label="邮箱地址"
            type="email"
            placeholder="your@email.com"
          />
          <FormInput
            label="密码"
            type="password"
            placeholder="请输入密码"
          />

          <Button type="submit" style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
            登 录
          </Button>
        </form>

        <div className="divider">或</div>

        <button className="google-btn" type="button">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          使用 Google 账号登录
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 14,
            color: "var(--text-secondary)",
          }}
        >
          还没有账号？
          <Link href="/register" style={{ color: "var(--brand)", fontWeight: 600, marginLeft: 4 }}>
            立即注册
          </Link>
        </p>
      </Card>
    </div>
  );
}
