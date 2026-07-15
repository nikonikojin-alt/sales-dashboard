function toUtcDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const date = toUtcDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

export function dayCount(startIso: string, endIso: string): number {
  const ms = toUtcDate(endIso).getTime() - toUtcDate(startIso).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

/** Equal-length range immediately preceding [startIso, endIso]. */
export function previousPeriodRange(startIso: string, endIso: string): { start: string; end: string } {
  const length = dayCount(startIso, endIso);
  const prevEnd = addDays(startIso, -1);
  const prevStart = addDays(prevEnd, -(length - 1));
  return { start: prevStart, end: prevEnd };
}

export function formatDateLabel(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export function formatMonthLabel(yyyyMm: string): string {
  const [y, m] = yyyyMm.split("-");
  return `${y}.${m}`;
}
