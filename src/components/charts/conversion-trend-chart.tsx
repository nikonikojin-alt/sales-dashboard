"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisTickStyle, tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "./chart-tooltip";

export interface ConversionPoint {
  label: string;
  conversionRate: number; // percent, e.g. 2.4
}

function ConversionTooltip({ active, payload }: { active?: boolean; payload?: { payload: ConversionPoint }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div style={tooltipContentStyle}>
      <div style={tooltipLabelStyle}>{point.label}</div>
      <div style={tooltipItemStyle}>구매 전환율 {point.conversionRate.toFixed(1)}%</div>
    </div>
  );
}

export function ConversionTrendChart({ data }: { data: ConversionPoint[] }) {
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
        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `${v}%`} />
        <Tooltip content={<ConversionTooltip />} cursor={{ stroke: "var(--baseline)", strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="conversionRate"
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
