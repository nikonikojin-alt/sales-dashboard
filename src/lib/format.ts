export function formatKrw(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 100_000_000) return `${sign}${(abs / 100_000_000).toFixed(1)}억원`;
  if (abs >= 10_000) return `${sign}${(abs / 10_000).toFixed(1)}만원`;
  return `${sign}${Math.round(abs).toLocaleString("ko-KR")}원`;
}

export function formatKrwAxis(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 100_000_000) return `${(abs / 100_000_000).toFixed(0)}억`;
  if (abs >= 10_000) return `${(abs / 10_000).toFixed(0)}만`;
  return `${abs}`;
}

export function formatCompactNumber(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 10_000) return `${sign}${(abs / 10_000).toFixed(1)}만`;
  return `${sign}${Math.round(abs).toLocaleString("ko-KR")}`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatDelta(delta: number | null, kind: "pp" | "pct"): string {
  if (delta === null) return "—";
  const sign = delta > 0 ? "+" : "";
  const suffix = kind === "pp" ? "%p" : "%";
  return `${sign}${delta.toFixed(1)}${suffix}`;
}
