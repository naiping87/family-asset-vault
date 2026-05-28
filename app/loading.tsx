export default function LoadingPage() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      padding: 48,
    }}>
      <div className="skeleton-shimmer" style={{
        width: 200,
        height: 16,
        borderRadius: 8,
      }} />
    </div>
  );
}
