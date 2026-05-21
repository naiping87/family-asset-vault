"use client";

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <div className="top-bar glass-intense mobile-only">
      <span style={{ fontWeight: 700, fontSize: 17 }}>Family Asset Vault</span>
      <button className="btn btn-secondary btn-icon" onClick={onMenuToggle}>
        ☰
      </button>
    </div>
  );
}
