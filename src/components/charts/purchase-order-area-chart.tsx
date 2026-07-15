"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisTickStyle, tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "./chart-tooltip";

export interface PurchaseOrderPoint {
  label: string;
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifthPlus: number;
}

const SERIES: { key: keyof Omit<PurchaseOrderPoint, "label">; name: string; color: string }[] = [
  { key: "first", name: "첫 구매", color: "var(--series-1)" },
  { key: "second", name: "2차 구매", color: "var(--series-2)" },
  { key: "third", name: "3차 구매", color: "var(--series-3)" },
  { key: "fourth", name: "4차 구매", color: "var(--series-4)" },
  { key: "fifthPlus", name: "5차 이상", color: "var(--series-5)" },
];

function PurchaseOrderTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={tooltipContentStyle}>
      <div style={tooltipLabelStyle}>{label}</div>
      {[...payload].reverse().map((p) => (
        <div key={p.name} style={tooltipItemStyle} className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-secondary">{p.name}</span>
          <span className="ml-auto tabular-nums">{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

export function PurchaseOrderAreaChart({ data }: { data: PurchaseOrderPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
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
          width={40}
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<PurchaseOrderTooltip />} cursor={{ stroke: "var(--baseline)", strokeWidth: 1 }} />
        <Legend
          verticalAlign="top"
          height={32}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
        />
        {SERIES.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stackId="po"
            stroke={s.color}
            strokeWidth={2}
            fill={s.color}
            fillOpacity={0.1}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
