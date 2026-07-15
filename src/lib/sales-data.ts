import { parseCsv } from "./csv-parser";
import type { PurchaseOrderCounts, PurchaseOrderRatios, SalesDay, SalesPeriod } from "./types";

export const SALES_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXb9zbghOqaxeN3EBFJQdRNR7Sa_TxASUVkaymFJClw8eE93VoTxgRPBjUpNZsiBPr9b5ajuaqIiAk/pub?output=csv";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Column layout of the published sheet (2 header rows, then daily data):
// 0 년도 | 1 월 | 2 일자 | 3 유입 | 4 가입 | 5 구매자 수 | 6 구매 건 수 | 7 실결제 매출 |
// 8 네이버페이 | 9 매출 합산 | 10 비고 | 11 캠페인 구분 | 12 메시지 발송 여부 |
// 13-17 첫~5차 이상 구매 | 18 합계 | 19-23 구매 차수별 비중
const COL = {
  year: 0,
  month: 1,
  date: 2,
  visits: 3,
  signups: 4,
  buyers: 5,
  orders: 6,
  revenuePaid: 7,
  revenueNaverPay: 8,
  revenueTotal: 9,
  note: 10,
  campaignType: 11,
  messageSent: 12,
  first: 13,
  second: 14,
  third: 15,
  fourth: 16,
  fifthPlus: 17,
  poTotal: 18,
  firstRatio: 19,
  secondRatio: 20,
  thirdRatio: 21,
  fourthRatio: 22,
  fifthPlusRatio: 23,
} as const;

function toNumber(raw: string | undefined): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/,/g, "").trim();
  if (cleaned === "") return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function toRatio(raw: string | undefined): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/%/g, "").trim();
  if (cleaned === "") return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n / 100 : 0;
}

export function parseSalesRows(csvText: string): SalesDay[] {
  const rows = parseCsv(csvText);

  return rows
    .filter((cells) => DATE_RE.test(cells[COL.date] ?? ""))
    .map((cells): SalesDay => {
      const purchaseOrder: PurchaseOrderCounts = {
        first: toNumber(cells[COL.first]),
        second: toNumber(cells[COL.second]),
        third: toNumber(cells[COL.third]),
        fourth: toNumber(cells[COL.fourth]),
        fifthPlus: toNumber(cells[COL.fifthPlus]),
        total: toNumber(cells[COL.poTotal]),
      };
      const purchaseOrderRatio: PurchaseOrderRatios = {
        first: toRatio(cells[COL.firstRatio]),
        second: toRatio(cells[COL.secondRatio]),
        third: toRatio(cells[COL.thirdRatio]),
        fourth: toRatio(cells[COL.fourthRatio]),
        fifthPlus: toRatio(cells[COL.fifthPlusRatio]),
      };

      return {
        date: cells[COL.date],
        year: toNumber(cells[COL.year]),
        month: toNumber(cells[COL.month]),
        visits: toNumber(cells[COL.visits]),
        signups: toNumber(cells[COL.signups]),
        buyers: toNumber(cells[COL.buyers]),
        orders: toNumber(cells[COL.orders]),
        revenuePaid: toNumber(cells[COL.revenuePaid]),
        revenueNaverPay: toNumber(cells[COL.revenueNaverPay]),
        revenueTotal: toNumber(cells[COL.revenueTotal]),
        note: (cells[COL.note] ?? "").trim(),
        campaignType: (cells[COL.campaignType] ?? "").trim(),
        messageSent: (cells[COL.messageSent] ?? "").trim() === "O",
        purchaseOrder,
        purchaseOrderRatio,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getSalesData(): Promise<SalesDay[]> {
  const res = await fetch(SALES_CSV_URL, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`매출 데이터를 불러오지 못했습니다 (HTTP ${res.status})`);
  }
  const csvText = await res.text();
  return parseSalesRows(csvText);
}

function sumPurchaseOrder(rows: SalesDay[]): PurchaseOrderCounts {
  return rows.reduce(
    (acc, row) => ({
      first: acc.first + row.purchaseOrder.first,
      second: acc.second + row.purchaseOrder.second,
      third: acc.third + row.purchaseOrder.third,
      fourth: acc.fourth + row.purchaseOrder.fourth,
      fifthPlus: acc.fifthPlus + row.purchaseOrder.fifthPlus,
      total: acc.total + row.purchaseOrder.total,
    }),
    { first: 0, second: 0, third: 0, fourth: 0, fifthPlus: 0, total: 0 },
  );
}

function ratiosFromCounts(counts: PurchaseOrderCounts): PurchaseOrderRatios {
  const total = counts.total || 1;
  return {
    first: counts.first / total,
    second: counts.second / total,
    third: counts.third / total,
    fourth: counts.fourth / total,
    fifthPlus: counts.fifthPlus / total,
  };
}

export function summarizeRows(rows: SalesDay[], label: string): SalesPeriod {
  const purchaseOrder = sumPurchaseOrder(rows);
  return {
    label,
    visits: rows.reduce((s, r) => s + r.visits, 0),
    signups: rows.reduce((s, r) => s + r.signups, 0),
    buyers: rows.reduce((s, r) => s + r.buyers, 0),
    orders: rows.reduce((s, r) => s + r.orders, 0),
    revenuePaid: rows.reduce((s, r) => s + r.revenuePaid, 0),
    revenueNaverPay: rows.reduce((s, r) => s + r.revenueNaverPay, 0),
    revenueTotal: rows.reduce((s, r) => s + r.revenueTotal, 0),
    purchaseOrder,
    purchaseOrderRatio: ratiosFromCounts(purchaseOrder),
  };
}

export function aggregateMonthly(rows: SalesDay[]): SalesPeriod[] {
  const groups = new Map<string, SalesDay[]>();
  for (const row of rows) {
    const key = row.date.slice(0, 7); // YYYY-MM
    const group = groups.get(key);
    if (group) {
      group.push(row);
    } else {
      groups.set(key, [row]);
    }
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, groupRows]) => summarizeRows(groupRows, key));
}

export function dayToPeriod(day: SalesDay): SalesPeriod {
  return {
    label: day.date,
    visits: day.visits,
    signups: day.signups,
    buyers: day.buyers,
    orders: day.orders,
    revenuePaid: day.revenuePaid,
    revenueNaverPay: day.revenueNaverPay,
    revenueTotal: day.revenueTotal,
    purchaseOrder: day.purchaseOrder,
    purchaseOrderRatio: day.purchaseOrderRatio,
  };
}

export interface CampaignRevenueRow {
  campaignType: string;
  revenueTotal: number;
  days: number;
}

export function aggregateByCampaign(rows: SalesDay[]): CampaignRevenueRow[] {
  const groups = new Map<string, { revenueTotal: number; days: number }>();
  for (const row of rows) {
    const key = row.campaignType || "미지정";
    const group = groups.get(key) ?? { revenueTotal: 0, days: 0 };
    group.revenueTotal += row.revenueTotal;
    group.days += 1;
    groups.set(key, group);
  }
  return [...groups.entries()].map(([campaignType, v]) => ({ campaignType, ...v }));
}
