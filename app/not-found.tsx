import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 16 }}>
      <Card variant="intense" style={{ maxWidth: 420, padding: 36, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>404 - Page Not Found</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>The page you are looking for does not exist.</p>
        <Link href="/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
