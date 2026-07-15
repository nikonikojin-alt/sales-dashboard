import type { SalesDay } from "./types";
import { summarizeRows } from "./sales-data";

export type KpiFormat = "currency" | "number" | "percent";

export interface KpiValue {
  key: string;
  label: string;
  value: number;
  format: KpiFormat;
  /** Percentage-point delta for rate KPIs, relative % change for count/currency KPIs. Null if no prior-period data. */
  delta: number | null;
  deltaKind: "pp" | "pct";
}

function relativeChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function computeKpis(current: SalesDay[], previous: SalesDay[]): KpiValue[] {
  const cur = summarizeRows(current, "current");
  const prev = previous.length > 0 ? summarizeRows(previous, "previous") : null;

  const curConversion = cur.visits > 0 ? (cur.buyers / cur.visits) * 100 : 0;
  const prevConversion = prev && prev.visits > 0 ? (prev.buyers / prev.visits) * 100 : null;

  const curRepeat = cur.purchaseOrder.total > 0 ? (1 - cur.purchaseOrderRatio.first) * 100 : 0;
  const prevRepeat = prev && prev.purchaseOrder.total > 0 ? (1 - prev.purchaseOrderRatio.first) * 100 : null;

  const curAov = cur.orders > 0 ? cur.revenueTotal / cur.orders : 0;
  const prevAov = prev && prev.orders > 0 ? prev.revenueTotal / prev.orders : null;

  return [
    {
      key: "revenue",
      label: "총 매출액",
      value: cur.revenueTotal,
      format: "currency",
      delta: prev ? relativeChange(cur.revenueTotal, prev.revenueTotal) : null,
      deltaKind: "pct",
    },
    {
      key: "visits",
      label: "총 유입수",
      value: cur.visits,
      format: "number",
      delta: prev ? relativeChange(cur.visits, prev.visits) : null,
      deltaKind: "pct",
    },
    {
      key: "signups",
      label: "총 가입자수",
      value: cur.signups,
      format: "number",
      delta: prev ? relativeChange(cur.signups, prev.signups) : null,
      deltaKind: "pct",
    },
    {
      key: "conversion",
      label: "구매 전환율",
      value: curConversion,
      format: "percent",
      delta: prevConversion !== null ? curConversion - prevConversion : null,
      deltaKind: "pp",
    },
    {
      key: "repeat",
      label: "재구매율",
      value: curRepeat,
      format: "percent",
      delta: prevRepeat !== null ? curRepeat - prevRepeat : null,
      deltaKind: "pp",
    },
    {
      key: "aov",
      label: "평균 객단가",
      value: curAov,
      format: "currency",
      delta: prevAov !== null ? relativeChange(curAov, prevAov) : null,
      deltaKind: "pct",
    },
  ];
}
