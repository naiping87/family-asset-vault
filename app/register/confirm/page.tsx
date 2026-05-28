import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function ConfirmPage() {
  const t = await getT();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 16 }}>
      <Card variant="intense" style={{ width: "100%", maxWidth: 420, padding: 36, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{t("auth.confirmTitle")}</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{t("auth.confirmDesc")}</p>
        <Link href="/login">
          <Button variant="primary" style={{ width: "100%", justifyContent: "center" }}>{t("auth.backToLogin")}</Button>
        </Link>
      </Card>
    </div>
  );
}
