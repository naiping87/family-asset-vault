interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: "0 4px" }}>›</span>}
          {item.href ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
