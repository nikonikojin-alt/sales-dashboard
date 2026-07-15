export function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {subtitle ? <p className="text-xs text-text-muted">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}
