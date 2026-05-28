"use client";

import { useT } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const { t } = useT();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 16 }}>
      <Card variant="intense" style={{ maxWidth: 420, padding: 36, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{t("error.title")}</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>{t("error.body")}</p>
        <Button variant="primary" onClick={reset}>{t("error.retry")}</Button>
      </Card>
    </div>
  );
}
