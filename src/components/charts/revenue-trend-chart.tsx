"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatKrw, formatKrwAxis } from "@/lib/format";
import { axisTickStyle, tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "./chart-tooltip";

export interface RevenueTrendPoint {
  label: string;
  revenueTotal: number;
  note?: string;
}

function RevenueTooltip({ active, payload }: { active?: boolean; payload?: { payload: RevenueTrendPoint }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div style={tooltipContentStyle}>
      <div style={tooltipLabelStyle}>{point.label}</div>
      <div style={tooltipItemStyle}>{formatKrw(point.revenueTotal)}</div>
      {point.note ? <div className="mt-1 text-text-muted">{point.note}</div> : null}
    </div>
  );
}

export function RevenueTrendChart({ data }: { data: RevenueTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--gridline)" strokeWidth={1} />
        <XAxis
          dataKey="label"
          tick={axisTickStyle}
          axisLine={{ stroke: "var(--baseline)" }}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={32}
        />
        <YAxis
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatKrwAxis}
          width={48}
        />
        <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "var(--baseline)", strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="revenueTotal"
          stroke="var(--series-1)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          activeDot={{ r: 4, fill: "var(--series-1)", stroke: "var(--surface-1)", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
