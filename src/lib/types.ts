export interface PurchaseOrderCounts {
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifthPlus: number;
  total: number;
}

export interface PurchaseOrderRatios {
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifthPlus: number;
}

export interface SalesDay {
  date: string; // YYYY-MM-DD
  year: number;
  month: number;
  visits: number;
  signups: number;
  buyers: number;
  orders: number;
  revenuePaid: number;
  revenueNaverPay: number;
  revenueTotal: number;
  note: string;
  campaignType: string;
  messageSent: boolean;
  purchaseOrder: PurchaseOrderCounts;
  purchaseOrderRatio: PurchaseOrderRatios;
}

export interface SalesPeriod {
  label: string; // date (daily) or "YYYY-MM" (monthly)
  visits: number;
  signups: number;
  buyers: number;
  orders: number;
  revenuePaid: number;
  revenueNaverPay: number;
  revenueTotal: number;
  purchaseOrder: PurchaseOrderCounts;
  purchaseOrderRatio: PurchaseOrderRatios;
}

export type ViewMode = "daily" | "monthly";
