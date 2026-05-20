export default function Breadcrumb({ items }) {
  return (
    <div className="breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: '0 8px' }}>›</span>}
          {item.href ? (
            <a href={item.href} onClick={item.onClick}>{item.label}</a>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
