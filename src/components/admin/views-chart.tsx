"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Eye, Users } from "lucide-react";

export type RangeKey = "7d" | "14d" | "30d" | "90d";
export type SeriesKey = "views" | "visitors";

type DatePoint = { date: string; count: number };

type ViewsChartProps = {
  views: DatePoint[];
  viewsCompare: DatePoint[];
  visitors: DatePoint[];
  visitorsCompare: DatePoint[];
  uniqueVisitors: number;
  returningPct: number | null;
  viewsPerVisitor: number;
  range: RangeKey;
  onRangeChange: (r: RangeKey) => void;
};

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "7D" },
  { key: "14d", label: "14D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
];

function monotonePath(points: { x: number; y: number }[]): string {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M ${points[0].x} ${points[0].y}`;
  const dx: number[] = [];
  const dy: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1].x - points[i].x;
    dy[i] = points[i + 1].y - points[i].y;
    m[i] = dx[i] === 0 ? 0 : dy[i] / dx[i];
  }
  const slopes: number[] = new Array(n);
  slopes[0] = m[0];
  slopes[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (m[i - 1] * m[i] <= 0) slopes[i] = 0;
    else slopes[i] = (m[i - 1] + m[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      slopes[i] = 0;
      slopes[i + 1] = 0;
    } else {
      const a = slopes[i] / m[i];
      const b = slopes[i + 1] / m[i];
      const s = a * a + b * b;
      if (s > 9) {
        const t = 3 / Math.sqrt(s);
        slopes[i] = t * a * m[i];
        slopes[i + 1] = t * b * m[i];
      }
    }
  }
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i];
    const c1x = points[i].x + h / 3;
    const c1y = points[i].y + (slopes[i] * h) / 3;
    const c2x = points[i + 1].x - h / 3;
    const c2y = points[i + 1].y - (slopes[i + 1] * h) / 3;
    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${points[i + 1].x} ${points[i + 1].y}`;
  }
  return path;
}

function niceCeil(value: number): number {
  if (value <= 4) return 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  let nice: number;
  if (normalized <= 1) nice = 1;
  else if (normalized <= 2) nice = 2;
  else if (normalized <= 2.5) nice = 2.5;
  else if (normalized <= 5) nice = 5;
  else nice = 10;
  return nice * magnitude;
}

type LabelFormat = "full" | "medium" | "short";

function fmtDate(iso: string, fmt: LabelFormat) {
  const d = new Date(iso);
  if (fmt === "full") {
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  if (fmt === "medium") {
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatTick(t: number): string {
  if (t >= 1000) return `${(t / 1000).toFixed(t % 1000 === 0 ? 0 : 1)}k`;
  return Math.round(t).toString();
}

// Given a container width and a count of data points, decide:
// - how many labels to show
// - which indices to use
// - what format to use (full weekday / medium / short numeric)
function chooseLabels(
  pointCount: number,
  containerWidth: number
): { indices: number[]; format: LabelFormat } {
  if (pointCount === 0) return { indices: [], format: "medium" };

  // Try formats from richest to tersest, pick one that fits.
  const formats: { fmt: LabelFormat; minPx: number }[] = [
    { fmt: "full", minPx: 96 },
    { fmt: "medium", minPx: 58 },
    { fmt: "short", minPx: 38 },
  ];

  for (const { fmt, minPx } of formats) {
    const maxCount = Math.max(2, Math.floor(containerWidth / minPx));
    if (maxCount >= Math.min(pointCount, 3)) {
      const stride = Math.max(1, Math.ceil((pointCount - 1) / (maxCount - 1)));
      const indices: number[] = [];
      for (let i = 0; i < pointCount; i += stride) indices.push(i);
      const last = pointCount - 1;
      if (indices[indices.length - 1] !== last) indices.push(last);
      return { indices, format: fmt };
    }
  }
  return { indices: [0, pointCount - 1], format: "short" };
}

function useCountUp(target: number, duration = 1600, delay = 0): number {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) {
      setValue(target);
      return;
    }
    let start: number | null = null;
    let raf = 0;
    function tick(t: number) {
      if (start === null) start = t;
      const elapsed = t - start - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, elapsed / duration);
      // easeOutQuint for a smooth settling feel
      const eased = 1 - Math.pow(1 - p, 5);
      const next = from + (target - from) * eased;
      setValue(next);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);

  return value;
}

export function ViewsChart({
  views,
  viewsCompare,
  visitors,
  visitorsCompare,
  uniqueVisitors,
  returningPct,
  viewsPerVisitor,
  range,
  onRangeChange,
}: ViewsChartProps) {
  const [series, setSeries] = useState<SeriesKey>("views");
  const [hover, setHover] = useState<number | null>(null);
  const [mountKey, setMountKey] = useState(0);
  const [chartPxWidth, setChartPxWidth] = useState(600);
  const lastSigRef = useRef("");
  const chartAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chartAreaRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.contentRect.width;
        if (w > 0) setChartPxWidth(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const data = series === "views" ? views : visitors;
  const compareData = series === "views" ? viewsCompare : visitorsCompare;

  useEffect(() => {
    const sig = `${series}-${range}-${data.length}`;
    if (lastSigRef.current !== sig) {
      lastSigRef.current = sig;
      setMountKey((k) => k + 1);
    }
  }, [series, range, data.length]);

  const stats = useMemo(() => {
    const total = data.reduce((s, d) => s + d.count, 0);
    const peak = data.reduce(
      (best, d) => (d.count > best.count ? d : best),
      { date: "", count: 0 }
    );
    const avg = data.length > 0 ? total / data.length : 0;
    const compareTotal = compareData.reduce((s, d) => s + d.count, 0);
    const delta =
      compareTotal > 0
        ? Math.round(((total - compareTotal) / compareTotal) * 100)
        : compareTotal === 0 && total > 0
          ? 100
          : null;
    return { total, avg, peak, compareTotal, delta };
  }, [data, compareData]);

  const animatedTotal = useCountUp(stats.total, 1800, 0);
  const animatedAvg = useCountUp(Math.round(stats.avg * 10) / 10, 1800, 80);
  const animatedPeak = useCountUp(stats.peak.count, 1800, 160);
  const animatedUnique = useCountUp(uniqueVisitors, 1800, 240);
  const animatedVpV = useCountUp(
    Math.round(viewsPerVisitor * 10) / 10,
    1800,
    240
  );
  const animatedReturning = useCountUp(returningPct ?? 0, 1800, 320);

  // SVG is now pure geometry — axis labels live in HTML overlays.
  const width = 800;
  const height = 200;
  const padL = 0;
  const padR = 0;
  const padT = 12;
  const padB = 12;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  const dataMax = Math.max(0, ...data.map((d) => d.count));
  const compareMax = Math.max(0, ...compareData.map((d) => d.count));
  const niceMax = niceCeil(Math.max(4, dataMax, compareMax));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = padL + i * stepX;
    const y = padT + innerH - (d.count / niceMax) * innerH;
    return { x, y, ...d };
  });

  const comparePoints =
    compareData.length === data.length
      ? compareData.map((d, i) => {
          const x = padL + i * stepX;
          const y = padT + innerH - (d.count / niceMax) * innerH;
          return { x, y, ...d };
        })
      : [];

  const linePath = monotonePath(points);
  const compareLinePath =
    comparePoints.length > 0 ? monotonePath(comparePoints) : "";
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${padT + innerH} L ${padL} ${padT + innerH} Z`
      : "";

  const yTicks = [0, niceMax / 4, niceMax / 2, (niceMax * 3) / 4, niceMax];
  const today = new Date().toDateString();
  const active = hover !== null ? points[hover] : null;
  const activeCompare =
    hover !== null && comparePoints.length > 0 ? comparePoints[hover] : null;
  const labelPlan = chooseLabels(points.length, chartPxWidth);

  const seriesColor = series === "views" ? "#0f766e" : "#7c3aed";
  const seriesColorDark = series === "views" ? "#134e4a" : "#4c1d95";
  const seriesGradId = series === "views" ? "viewsFill" : "visitorsFill";

  return (
    <div className="w-full">
      {/* Header: series toggle + range selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
          <SeriesPill
            active={series === "views"}
            onClick={() => setSeries("views")}
            icon={Eye}
            label="Views"
          />
          <SeriesPill
            active={series === "visitors"}
            onClick={() => setSeries("visitors")}
            icon={Users}
            label="Visitors"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => onRangeChange(r.key)}
              className={`px-3 py-1 text-xs font-medium rounded transition-all duration-300 ${
                range === r.key
                  ? "bg-white text-teal-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <StatPill
          label={series === "views" ? "Total views" : "Total unique"}
          value={Math.round(animatedTotal).toLocaleString()}
          accent
        />
        <StatPill
          label="Daily avg"
          value={animatedAvg.toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })}
        />
        <StatPill
          label="Peak day"
          value={
            stats.peak.count > 0 ? Math.round(animatedPeak).toLocaleString() : "—"
          }
          hint={
            stats.peak.date
              ? new Date(stats.peak.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : undefined
          }
        />
        <StatPill
          label="vs previous"
          value={
            stats.delta === null
              ? "—"
              : `${stats.delta > 0 ? "+" : ""}${stats.delta}%`
          }
          trend={
            stats.delta === null
              ? "flat"
              : stats.delta > 0
                ? "up"
                : stats.delta < 0
                  ? "down"
                  : "flat"
          }
        />
        <StatPill
          label="Views / visitor"
          value={animatedVpV.toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })}
          hint={`${Math.round(animatedUnique).toLocaleString()} visitors`}
        />
        <StatPill
          label="Returning"
          value={
            returningPct === null ? "—" : `${Math.round(animatedReturning)}%`
          }
          hint={returningPct === null ? undefined : "came back from prev period"}
        />
      </div>

      {data.length === 0 ? (
        <div className="h-56 w-full bg-gray-50 rounded flex items-center justify-center text-sm text-gray-400">
          No data in this range
        </div>
      ) : (
        <div
          className="grid gap-x-2"
          style={{ gridTemplateColumns: "40px 1fr" }}
        >
          {/* Y-axis labels (HTML, aligned to gridlines) */}
          <div className="relative h-56">
            {yTicks
              .slice()
              .reverse()
              .map((t, i) => {
                const yViewBox = padT + innerH - (t / niceMax) * innerH;
                const topPct = (yViewBox / height) * 100;
                return (
                  <span
                    key={i}
                    className="absolute right-0 text-[10px] text-gray-400 tabular-nums"
                    style={{
                      top: `${topPct}%`,
                      transform: "translateY(-50%)",
                      opacity: 0,
                      animation: `gridFade 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 90}ms forwards`,
                    }}
                  >
                    {formatTick(t)}
                  </span>
                );
              })}
          </div>

          {/* Chart area + x-axis labels */}
          <div>
            <div ref={chartAreaRef} className="relative h-56">
              <svg
                key={mountKey}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full overflow-visible"
                onMouseLeave={() => setHover(null)}
              >
                <defs>
                  <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="visitorsFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Gridlines, gentle staggered fade */}
                {yTicks.map((t, i) => {
                  const y = padT + innerH - (t / niceMax) * innerH;
                  return (
                    <line
                      key={i}
                      x1={padL}
                      x2={width - padR}
                      y1={y}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeDasharray={i === 0 ? "0" : "3 3"}
                      vectorEffect="non-scaling-stroke"
                      style={{
                        opacity: 0,
                        animation: `gridFade 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 90}ms forwards`,
                      }}
                    />
                  );
                })}

            {/* Area fill: fades in slowly alongside the line */}
            <path
              d={areaPath}
              fill={`url(#${seriesGradId})`}
              style={{
                opacity: 0,
                animation:
                  "areaFade 1400ms cubic-bezier(0.22, 1, 0.36, 1) 700ms forwards",
              }}
            />

            {/* Compare line: appears after main line completes */}
            {compareLinePath && (
              <path
                d={compareLinePath}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: 0,
                  animation:
                    "compareFade 900ms cubic-bezier(0.22, 1, 0.36, 1) 1800ms forwards",
                }}
              />
            )}

            {/* Main line: smooth draw-in using normalized pathLength */}
            <path
              d={linePath}
              fill="none"
              stroke={seriesColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: 1,
                animation:
                  "lineDraw 2000ms cubic-bezier(0.65, 0, 0.35, 1) 500ms forwards",
              }}
            />

            {/* Hover guide */}
            {active && (
              <line
                x1={active.x}
                x2={active.x}
                y1={padT}
                y2={padT + innerH}
                stroke={seriesColor}
                strokeDasharray="3 3"
                strokeOpacity="0.4"
              />
            )}

            {/* Data dots pop in after line completes */}
            {points.map((p, i) => {
              const isToday = new Date(p.date).toDateString() === today;
              const isHover = hover === i;
              if (!isToday && !isHover && data.length > 30) return null;
              const progress =
                points.length > 1 ? i / (points.length - 1) : 0;
              const delay = 2100 + progress * 500;
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={isToday ? 4.5 : isHover ? 4 : 3}
                  fill={isToday ? seriesColorDark : seriesColor}
                  stroke="white"
                  strokeWidth="1.75"
                  style={{
                    transformOrigin: `${p.x}px ${p.y}px`,
                    transform: "scale(0)",
                    opacity: 0,
                    animation: `dotPop 500ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms forwards${
                      isToday
                        ? `, todayPulse 2400ms ease-in-out ${delay + 500}ms infinite`
                        : ""
                    }`,
                  }}
                />
              );
            })}

            {/* Hit areas */}
            {points.map((p, i) => (
              <rect
                key={`hit-${i}`}
                x={p.x - (stepX || innerW) / 2}
                y={padT}
                width={stepX || innerW}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            ))}
          </svg>

          {/* Tooltip (positioned over chart area) */}
          {active && (
            <div
              className="absolute pointer-events-none bg-white border border-gray-200 shadow-md rounded-md px-2.5 py-1.5 text-xs"
              style={{
                left: `${(active.x / width) * 100}%`,
                top: `${(active.y / height) * 100}%`,
                transform: "translate(-50%, calc(-100% - 10px))",
                whiteSpace: "nowrap",
                zIndex: 10,
              }}
            >
              <div className="text-[10px] text-gray-500 mb-0.5">
                {new Date(active.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: seriesColor }}
                />
                <span className="font-semibold text-gray-900">
                  {active.count.toLocaleString()}
                </span>
                <span className="text-gray-500">
                  {series === "views"
                    ? active.count === 1
                      ? "view"
                      : "views"
                    : active.count === 1
                      ? "visitor"
                      : "visitors"}
                </span>
              </div>
              {activeCompare && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-0.5 bg-slate-400 rounded-full" />
                  <span className="text-gray-700">
                    {activeCompare.count.toLocaleString()}
                  </span>
                  <span className="text-gray-500">prev</span>
                </div>
              )}
            </div>
          )}
          </div>

            {/* X-axis labels (HTML, density based on measured width) */}
            <div className="relative mt-2 h-4">
              {labelPlan.indices.map((idx, i) => {
                const pct =
                  points.length > 1 ? (idx / (points.length - 1)) * 100 : 0;
                const isToday =
                  new Date(points[idx].date).toDateString() === today;
                const label = fmtDate(points[idx].date, labelPlan.format);
                const transform =
                  idx === 0
                    ? "translateX(0)"
                    : idx === points.length - 1
                      ? "translateX(-100%)"
                      : "translateX(-50%)";
                const delay = 400 + i * 60;
                return (
                  <span
                    key={idx}
                    className={`absolute whitespace-nowrap text-[10px] tabular-nums ${
                      isToday
                        ? "font-semibold"
                        : "text-gray-500"
                    }`}
                    style={{
                      left: `${pct}%`,
                      transform,
                      color: isToday ? seriesColorDark : undefined,
                      opacity: 0,
                      animation: `labelRise 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms forwards`,
                    }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes lineDraw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes gridFade {
          from {
            opacity: 0;
            transform: translateX(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes areaFade {
          to {
            opacity: 1;
          }
        }
        @keyframes compareFade {
          to {
            opacity: 0.75;
          }
        }
        @keyframes labelRise {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes dotPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.15);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes todayPulse {
          0%,
          100% {
            filter: drop-shadow(0 0 0 rgba(15, 118, 110, 0));
          }
          50% {
            filter: drop-shadow(0 0 4px rgba(15, 118, 110, 0.6));
          }
        }
      `}</style>
    </div>
  );
}

function SeriesPill({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all duration-300 ${
        active
          ? "bg-white text-teal-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

function StatPill({
  label,
  value,
  hint,
  trend,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: "up" | "down" | "flat";
  accent?: boolean;
}) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
        ? "text-rose-600"
        : "text-gray-400";
  return (
    <div
      className={`min-w-0 rounded-md border px-3 py-2 transition-colors ${
        accent
          ? "bg-teal-50 border-teal-200"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <p
          className={`text-base font-bold truncate ${accent ? "text-teal-900" : "text-gray-900"}`}
        >
          {value}
        </p>
        {trend && <TrendIcon size={12} className={trendColor} />}
      </div>
      {hint && <p className="text-[10px] text-gray-400 truncate">{hint}</p>}
    </div>
  );
}
