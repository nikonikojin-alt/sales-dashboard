import type { ViewMode } from "@/lib/types";

export type PeriodPreset = "all" | "30" | "90" | "180";

const PRESETS: { value: PeriodPreset; label: string }[] = [
  { value: "all", label: "전체 기간" },
  { value: "30", label: "최근 30일" },
  { value: "90", label: "최근 90일" },
  { value: "180", label: "최근 6개월" },
];

function SegmentButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-series-1 text-white"
          : "text-text-secondary hover:bg-gridline/60"
      }`}
    >
      {active ? <span className="mr-1">✓</span> : null}
      {children}
    </button>
  );
}

export function FilterBar({
  preset,
  onPresetChange,
  viewMode,
  onViewModeChange,
}: {
  preset: PeriodPreset;
  onPresetChange: (preset: PeriodPreset) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-2">
      <div className="flex flex-wrap items-center gap-1">
        {PRESETS.map((p) => (
          <SegmentButton key={p.value} active={preset === p.value} onClick={() => onPresetChange(p.value)}>
            {p.label}
          </SegmentButton>
        ))}
      </div>
      <div className="flex items-center gap-1 rounded-md bg-gridline/40 p-1">
        <SegmentButton active={viewMode === "daily"} onClick={() => onViewModeChange("daily")}>
          일별
        </SegmentButton>
        <SegmentButton active={viewMode === "monthly"} onClick={() => onViewModeChange("monthly")}>
          월별
        </SegmentButton>
      </div>
    </div>
  );
}
