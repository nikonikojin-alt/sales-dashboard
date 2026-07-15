"use client";

import { useMemo, useState } from "react";
import type { SalesDay, ViewMode } from "@/lib/types";
import { aggregateByCampaign, aggregateMonthly, dayToPeriod } from "@/lib/sales-data";
import { computeKpis } from "@/lib/kpi";
import { addDays, formatDateLabel, formatMonthLabel, previousPeriodRange } from "@/lib/date-utils";
import { FilterBar, type PeriodPreset } from "@/components/filter-bar";
import { KpiCard } from "@/components/kpi-card";
import { ChartCard } from "@/components/chart-card";
import { RevenueTrendChart } from "@/components/charts/revenue-trend-chart";
import { PurchaseOrderAreaChart } from "@/components/charts/purchase-order-area-chart";
import { CampaignBarChart } from "@/components/charts/campaign-bar-chart";
import { ConversionTrendChart } from "@/components/charts/conversion-trend-chart";
import { DataTable } from "@/components/data-table";

const PRESET_DAYS: Record<PeriodPreset, number | null> = {
  all: null,
  "30": 30,
  "90": 90,
  "180": 180,
};

export function Dashboard({ rows }: { rows: SalesDay[] }) {
  const [preset, setPreset] = useState<PeriodPreset>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  const minDate = rows[0]?.date;
  const maxDate = rows[rows.length - 1]?.date;

  const { currentRows, previousRows } = useMemo(() => {
    if (!minDate || !maxDate) return { currentRows: [] as SalesDay[], previousRows: [] as SalesDay[] };

    const days = PRESET_DAYS[preset];
    const start = days === null ? minDate : addDays(maxDate, -(days - 1)) < minDate ? minDate : addDays(maxDate, -(days - 1));
    const end = maxDate;

    const current = rows.filter((r) => r.date >= start && r.date <= end);
    const prevRange = previousPeriodRange(start, end);
    const previous = rows.filter((r) => r.date >= prevRange.start && r.date <= prevRange.end);

    return { currentRows: current, previousRows: previous };
  }, [rows, preset, minDate, maxDate]);

  const kpis = useMemo(() => computeKpis(currentRows, previousRows), [currentRows, previousRows]);

  const periods = useMemo(
    () => (viewMode === "daily" ? currentRows.map(dayToPeriod) : aggregateMonthly(currentRows)),
    [currentRows, viewMode],
  );

  const formatLabel = viewMode === "daily" ? formatDateLabel : formatMonthLabel;

  const revenueTrendData = useMemo(
    () =>
      periods.map((p, i) => ({
        label: formatLabel(p.label),
        revenueTotal: p.revenueTotal,
        note: viewMode === "daily" ? currentRows[i]?.note : undefined,
      })),
    [periods, currentRows, viewMode, formatLabel],
  );

  const purchaseOrderData = useMemo(
    () =>
      periods.map((p) => ({
        label: formatLabel(p.label),
        first: p.purchaseOrderRatio.first * 100,
        second: p.purchaseOrderRatio.second * 100,
        third: p.purchaseOrderRatio.third * 100,
        fourth: p.purchaseOrderRatio.fourth * 100,
        fifthPlus: p.purchaseOrderRatio.fifthPlus * 100,
      })),
    [periods, formatLabel],
  );

  const conversionData = useMemo(
    () =>
      periods.map((p) => ({
        label: formatLabel(p.label),
        conversionRate: p.visits > 0 ? (p.buyers / p.visits) * 100 : 0,
      })),
    [periods, formatLabel],
  );

  const campaignData = useMemo(() => aggregateByCampaign(currentRows), [currentRows]);

  return (
    <div className="flex flex-col gap-4">
      <FilterBar preset={preset} onPresetChange={setPreset} viewMode={viewMode} onViewModeChange={setViewMode} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.key} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="일별 매출 추이" subtitle="실결제 매출 + 네이버페이 합산">
          <RevenueTrendChart data={revenueTrendData} />
        </ChartCard>
        <ChartCard title="구매 전환율 추이" subtitle="구매자 수 / 유입 수">
          <ConversionTrendChart data={conversionData} />
        </ChartCard>
        <ChartCard title="구매 차수별 비중 추이" subtitle="당일 구매 건 중 차수별 비중(%)">
          <PurchaseOrderAreaChart data={purchaseOrderData} />
        </ChartCard>
        <ChartCard title="캠페인/이벤트별 매출 비교" subtitle="선택 기간 내 캠페인 구분별 매출 합계">
          <CampaignBarChart data={campaignData} />
        </ChartCard>
      </div>

      <DataTable periods={periods} viewMode={viewMode} />
    </div>
  );
}
