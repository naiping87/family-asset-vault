import { Card } from "./Card";

interface FinanceItem {
  label: string;
  value: string;
}

interface PropertyCardProps {
  name: string;
  address: string;
  badge?: React.ReactNode;
  finance: FinanceItem[];
  onClick?: () => void;
}

export function PropertyCard({
  name,
  address,
  badge,
  finance,
  onClick,
}: PropertyCardProps) {
  return (
    <Card variant="subtle" className="property-card" onClick={onClick}>
      <div className="property-card-header">
        <div className="property-name">{name}</div>
        {badge}
      </div>
      <div className="property-address">
        <span>📍</span> {address}
      </div>
      <div className="property-finance">
        {finance.map((item, i) => (
          <div className="finance-item" key={i}>
            <div className="finance-label">{item.label}</div>
            <div className="finance-value">{item.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
