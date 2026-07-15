import type { SalesPeriod, ViewMode } from "@/lib/types";
import { formatMonthLabel, formatDateLabel } from "@/lib/date-utils";
import { formatKrw } from "@/lib/format";

export function DataTable({ periods, viewMode }: { periods: SalesPeriod[]; viewMode: ViewMode }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">데이터 표</h3>
      <div className="max-h-96 overflow-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="sticky top-0 bg-surface text-text-muted">
            <tr className="border-b border-line">
              <th className="py-2 pr-4 font-medium">{viewMode === "daily" ? "날짜" : "월"}</th>
              <th className="py-2 pr-4 font-medium">유입</th>
              <th className="py-2 pr-4 font-medium">가입</th>
              <th className="py-2 pr-4 font-medium">구매자</th>
              <th className="py-2 pr-4 font-medium">전환율</th>
              <th className="py-2 pr-4 font-medium">매출 합산</th>
              <th className="py-2 pr-4 font-medium">재구매율</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {periods.map((p) => {
              const conversion = p.visits > 0 ? (p.buyers / p.visits) * 100 : 0;
              const repeat = p.purchaseOrder.total > 0 ? (1 - p.purchaseOrderRatio.first) * 100 : 0;
              return (
                <tr key={p.label} className="border-b border-line/60 text-text-secondary">
                  <td className="py-1.5 pr-4 text-text-primary">
                    {viewMode === "daily" ? formatDateLabel(p.label) : formatMonthLabel(p.label)}
                  </td>
                  <td className="py-1.5 pr-4">{p.visits.toLocaleString("ko-KR")}</td>
                  <td className="py-1.5 pr-4">{p.signups.toLocaleString("ko-KR")}</td>
                  <td className="py-1.5 pr-4">{p.buyers.toLocaleString("ko-KR")}</td>
                  <td className="py-1.5 pr-4">{conversion.toFixed(1)}%</td>
                  <td className="py-1.5 pr-4">{formatKrw(p.revenueTotal)}</td>
                  <td className="py-1.5 pr-4">{repeat.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
