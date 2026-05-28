"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
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
      <Card variant="intense" style={{ maxWidth: 420, padding: 36, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>出了点问题</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          应用遇到错误，请稍后重试
        </p>
        <Button variant="primary" onClick={reset}>
          重新加载
        </Button>
      </Card>
    </div>
  );
}
