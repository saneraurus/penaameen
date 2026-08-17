"use client";

import { useState } from "react";
import type { SalesAnalytics, SalesDataPoint } from "@/lib/admin/orders";

interface RevenueChartHeroProps {
  analytics: SalesAnalytics;
}

export function RevenueChartHero({ analytics }: RevenueChartHeroProps) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");
  const [hoveredPoint, setHoveredPoint] = useState<SalesDataPoint | null>(null);

  const activeData =
    timeframe === "7d" ? analytics.points7d : analytics.points30d;

  const totalCalculated = activeData.reduce((sum, d) => sum + d.revenue, 0);
  const maxRevenue = Math.max(...activeData.map((d) => d.revenue), 100000);
  const chartHeight = 220;
  const chartWidth = 700;
  const paddingX = 45;
  const paddingY = 25;

  const points = activeData.map((d, i) => {
    const divisor = activeData.length > 1 ? activeData.length - 1 : 1;
    const x = paddingX + (i / divisor) * (chartWidth - paddingX * 2);
    const y =
      maxRevenue > 0
        ? chartHeight -
          paddingY -
          (d.revenue / maxRevenue) * (chartHeight - paddingY * 2)
        : chartHeight - paddingY;
    return { x, y, ...d };
  });

  // Build SVG path with cubic bezier curves
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    if (!prev) return acc;
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
  }, "");

  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaD =
    lastPoint && firstPoint
      ? `${pathD} L ${lastPoint.x} ${chartHeight - paddingY} L ${firstPoint.x} ${chartHeight - paddingY} Z`
      : "";

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900/30 overflow-hidden relative">
      {/* Background Glow */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ● Live Database Stream
              </span>
              <span className="text-xs text-slate-400">Pena Ameen Store</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1.5 flex items-baseline gap-3">
              <span>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(totalCalculated)}
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60 inline-flex items-center gap-1">
                Data Absolut Server
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Grafik penjualan real-time yang dihitung murni dari database
              transaksi pesanan
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 border border-slate-700/60 rounded-xl backdrop-blur-xs">
            <button
              type="button"
              onClick={() => setTimeframe("7d")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                timeframe === "7d"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("30d")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                timeframe === "30d"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              30 Hari Terakhir
            </button>
          </div>
        </div>

        {/* Real Dynamic Chart */}
        <div className="relative">
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none z-20 bg-slate-900/95 border border-emerald-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(points.find((p) => p.date === hoveredPoint.date)?.x || 0) / (chartWidth / 100)}%`,
                top: `${(points.find((p) => p.date === hoveredPoint.date)?.y || 0) - 10}px`,
              }}
            >
              <span className="text-[10px] text-slate-400 block font-medium">
                {hoveredPoint.date}
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400 block">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(hoveredPoint.revenue)}
              </span>
              <span className="text-[11px] text-slate-300 block">
                {hoveredPoint.orders} transaksi tercatat
              </span>
            </div>
          )}

          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 sm:h-56 overflow-visible"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#059669" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="50%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>

                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y =
                  chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="4 4"
                      strokeOpacity="0.4"
                    />
                    <text
                      x={paddingX - 6}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#64748B"
                      fontFamily="monospace"
                    >
                      {Math.round((maxRevenue * ratio) / 1000)}k
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              <path d={areaD} fill="url(#areaGradient)" />

              {/* Smooth Spline Curve */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#strokeGradient)"
                strokeWidth="3.5"
                filter="url(#glow)"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.date === p.date ? "7" : "5"}
                    className="cursor-pointer transition-all duration-150 fill-slate-950 stroke-emerald-400"
                    strokeWidth="3"
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Date labels */}
                  {(activeData.length <= 10 ||
                    i % Math.ceil(activeData.length / 7) === 0 ||
                    i === activeData.length - 1) && (
                    <text
                      x={p.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#94A3B8"
                      fontWeight={i === points.length - 1 ? "bold" : "normal"}
                    >
                      {p.shortDate}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Micro KPI Bar at bottom of Hero */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">
              Transaksi Terbayar
            </span>
            <p className="text-base sm:text-lg font-bold font-mono text-white">
              {analytics.paidOrdersCount} Pesanan
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">
              Rata-rata Order (AOV)
            </span>
            <p className="text-base sm:text-lg font-bold font-mono text-white">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(analytics.averageOrderValue)}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">
              Total Pesanan Tercatat
            </span>
            <p className="text-base sm:text-lg font-bold font-mono text-emerald-400">
              {analytics.totalOrders} Transaksi
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">
              Integritas Data
            </span>
            <p className="text-base sm:text-lg font-bold font-mono text-cyan-400">
              100% Real Database
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
