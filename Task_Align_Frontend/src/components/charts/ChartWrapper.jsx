export default function ChartWrapper({ title, children }) {
  return (
    <div className="ta-card p-6">
      {title && <h3 className="mb-4 text-sm font-semibold text-ink">{title}</h3>}
      <div className="h-64">{children}</div>
    </div>
  );
}
