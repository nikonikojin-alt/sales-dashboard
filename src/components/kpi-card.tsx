import type { KpiValue } from "@/lib/kpi";
import { formatDelta, formatKrw, formatPercent, formatCompactNumber } from "@/lib/format";

function formatValue(kpi: KpiValue): string {
  switch (kpi.format) {
    case "currency":
      return formatKrw(kpi.value);
    case "percent":
      return formatPercent(kpi.value);
    case "number":
    default:
      return formatCompactNumber(kpi.value);
  }
}

export function KpiCard({ kpi }: { kpi: KpiValue }) {
  const deltaText = formatDelta(kpi.delta, kpi.deltaKind);
  const deltaTone = kpi.delta === null ? "text-text-muted" : kpi.delta > 0 ? "text-delta-good" : kpi.delta < 0 ? "text-delta-bad" : "text-text-muted";

  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="text-sm text-text-secondary">{kpi.label}</div>
      <div className="mt-1.5 text-[28px] font-semibold leading-none text-text-primary">{formatValue(kpi)}</div>
      <div className={`mt-2 text-xs font-medium ${deltaTone}`}>
        {deltaText}
        <span className="ml-1 text-text-muted font-normal">전기 대비</span>
      </div>
    </div>
  );
}
