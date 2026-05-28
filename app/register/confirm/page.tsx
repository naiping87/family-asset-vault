import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ConfirmPage() {
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
      <Card variant="intense" style={{ width: "100%", maxWidth: 420, padding: 36, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>请查收验证邮件</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
          我们已向您的邮箱发送了一封验证邮件，请点击邮件中的链接完成注册。
        </p>
        <Link href="/login">
          <Button variant="primary" style={{ width: "100%", justifyContent: "center" }}>
            返回登录
          </Button>
        </Link>
      </Card>
    </div>
  );
}
