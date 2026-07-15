"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatKrw, formatKrwAxis } from "@/lib/format";
import { axisTickStyle, tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "./chart-tooltip";

export interface CampaignRevenuePoint {
  campaignType: string;
  revenueTotal: number;
  days: number;
}

function CampaignTooltip({ active, payload }: { active?: boolean; payload?: { payload: CampaignRevenuePoint }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div style={tooltipContentStyle}>
      <div style={tooltipLabelStyle}>{point.campaignType}</div>
      <div style={tooltipItemStyle}>{formatKrw(point.revenueTotal)}</div>
      <div className="mt-1 text-text-muted">{point.days}일</div>
    </div>
  );
}

export function CampaignBarChart({ data }: { data: CampaignRevenuePoint[] }) {
  const sorted = [...data].sort((a, b) => b.revenueTotal - a.revenueTotal);
  const height = Math.max(200, sorted.length * 44);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--gridline)" strokeWidth={1} />
        <XAxis type="number" tick={axisTickStyle} axisLine={{ stroke: "var(--baseline)" }} tickLine={false} tickFormatter={formatKrwAxis} />
        <YAxis
          type="category"
          dataKey="campaignType"
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          width={96}
        />
        <Tooltip content={<CampaignTooltip />} cursor={{ fill: "var(--gridline)", opacity: 0.4 }} />
        <Bar dataKey="revenueTotal" fill="var(--series-1)" radius={[0, 4, 4, 0]} barSize={24} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
