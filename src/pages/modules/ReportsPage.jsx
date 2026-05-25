import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Cell,
} from "recharts";
import { useCrudModule } from "../../hooks/useCrudModule";
import { useSearchParams } from "react-router-dom";

/* ─────────────────────────────────────────────
   STATIC RICH REVENUE DATA  (daily / weekly / monthly views)
───────────────────────────────────────────── */
const staticRevenueData = {
  daily: [
    { period: "12 May", revenue: 14200, pending: 3100, refunds: 800,  growth: 8  },
    { period: "13 May", revenue: 17500, pending: 4200, refunds: 1100, growth: 12 },
    { period: "14 May", revenue: 13800, pending: 2900, refunds: 650,  growth: -4 },
    { period: "15 May", revenue: 19200, pending: 5100, refunds: 1350, growth: 15 },
    { period: "16 May", revenue: 16400, pending: 3800, refunds: 920,  growth: 7  },
    { period: "17 May", revenue: 21000, pending: 6200, refunds: 1500, growth: 18 },
    { period: "18 May", revenue: 18700, pending: 4600, refunds: 1080, growth: 10 },
  ],
  weekly: [
    { period: "Wk 1",  revenue: 95000,  pending: 18000, refunds: 5200,  growth: 6  },
    { period: "Wk 2",  revenue: 110000, pending: 22000, refunds: 7100,  growth: 11 },
    { period: "Wk 3",  revenue: 98000,  pending: 19500, refunds: 4800,  growth: -2 },
    { period: "Wk 4",  revenue: 125000, pending: 26000, refunds: 8400,  growth: 14 },
    { period: "Wk 5",  revenue: 117000, pending: 24000, refunds: 6900,  growth: 9  },
    { period: "Wk 6",  revenue: 132000, pending: 28000, refunds: 9200,  growth: 17 },
  ],
  monthly: [
    { period: "Nov",   revenue: 380000, pending: 72000, refunds: 21000, growth: 5  },
    { period: "Dec",   revenue: 420000, pending: 85000, refunds: 24000, growth: 9  },
    { period: "Jan",   revenue: 395000, pending: 78000, refunds: 18500, growth: -3 },
    { period: "Feb",   revenue: 460000, pending: 92000, refunds: 27000, growth: 14 },
    { period: "Mar",   revenue: 435000, pending: 88000, refunds: 25000, growth: 8  },
    { period: "Apr",   revenue: 498000, pending: 102000, refunds: 31000, growth: 19 },
    { period: "May",   revenue: 475000, pending: 96000, refunds: 28500, growth: 13 },
  ],
};

/* ─────────────────────────────────────────────
   COLOUR PALETTE
───────────────────────────────────────────── */
const COLORS = {
  revenue: { fill: "#10b981", stroke: "#059669", light: "#d1fae5", text: "#065f46" },
  pending: { fill: "#f59e0b", stroke: "#d97706", light: "#fef3c7", text: "#92400e" },
  refunds: { fill: "#ef4444", stroke: "#dc2626", light: "#fee2e2", text: "#991b1b" },
};

/* ─────────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const growth = payload[0]?.payload?.growth ?? 0;
  const isPositive = growth >= 0;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
        padding: "14px 18px",
        minWidth: "210px",
        fontFamily: "inherit",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
          paddingBottom: "8px",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "12px", color: "#111827" }}>
          {label}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            padding: "2px 8px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 700,
            background: isPositive ? "#d1fae5" : "#fee2e2",
            color: isPositive ? "#065f46" : "#991b1b",
          }}
        >
          {isPositive ? "▲" : "▼"} {isPositive ? "+" : ""}{growth}%
        </span>
      </div>

      {/* Rows */}
      {payload.map((entry) => {
        const key = entry.dataKey;
        const color = COLORS[key];
        const label =
          key === "revenue" ? "Revenue" : key === "pending" ? "Pending Dues" : "Refunds";
        return (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "7px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: color?.fill,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "12px", color: "#6b7280" }}>{label}</span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: color?.text }}>
              ₹{Number(entry.value).toLocaleString("en-IN")}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────
   CUSTOM LEGEND
───────────────────────────────────────────── */
const CustomLegend = () => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      justifyContent: "center",
      marginTop: "12px",
    }}
  >
    {[
      { key: "revenue", label: "Daily / Weekly / Monthly Revenue" },
      { key: "pending", label: "Pending Dues" },
      { key: "refunds", label: "Refunds" },
    ].map(({ key, label }) => (
      <div
        key={key}
        style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "default" }}
      >
        <span
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "3px",
            background: COLORS[key].fill,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>{label}</span>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   SUMMARY KPI PILL
───────────────────────────────────────────── */
const SummaryPill = ({ icon: Icon, label, value, colorKey }) => {
  const c = COLORS[colorKey];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px",
        borderRadius: "12px",
        background: c.light,
        border: `1px solid ${c.fill}30`,
        flex: "1 1 140px",
        minWidth: "140px",
      }}
    >
      <div
        style={{
          background: c.fill,
          borderRadius: "8px",
          padding: "7px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={15} color="#fff" />
      </div>
      <div>
        <div style={{ fontSize: "12px", color: c.text, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {label}
        </div>
        <div style={{ fontSize: "16px", fontWeight: 800, color: c.text, marginTop: "1px" }}>{value}</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ReportsPage() {
  const { items: billing } = useCrudModule("billing");
  const { items: appointments } = useCrudModule("appointments");
  const { items: patients } = useCrudModule("patients");
  const [period, setPeriod] = useState("monthly");
  const [chartView, setChartView] = useState("grouped"); // grouped | stacked
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const qp = searchParams.get("period");
    if (qp === "daily" || qp === "monthly") setPeriod(qp);
  }, [searchParams]);

  /* KPIs from live data */
  const kpis = useMemo(() => {
    const revenue = billing.reduce((sum, b) => sum + Number(b.paid || 0), 0);
    const due = billing.reduce((sum, b) => sum + Number(b.due || 0), 0);
    return {
      revenue,
      due,
      patientCount: patients.length,
      appointmentCount: appointments.length,
    };
  }, [billing, appointments, patients]);

  /* Chart data — use static rich data keyed by period */
  const chartData = staticRevenueData[period] ?? staticRevenueData.monthly;

  /* Totals for summary pills */
  const totals = useMemo(() => {
    const rev = chartData.reduce((s, r) => s + r.revenue, 0);
    const pend = chartData.reduce((s, r) => s + r.pending, 0);
    const ref = chartData.reduce((s, r) => s + r.refunds, 0);
    return { rev, pend, ref };
  }, [chartData]);

  const fmtINR = (v) => `₹${Number(v).toLocaleString("en-IN")}`;

  /* Export */
  const onExport = (type) => {
    const fileName = `hospital-${period}-report.${type === "pdf" ? "pdf" : "xlsx"}`;
    const blob = new Blob(
      [
        `Hospital ${period} report\nRevenue: ${kpis.revenue}\nDue: ${kpis.due}\nPatients: ${kpis.patientCount}\nAppointments: ${kpis.appointmentCount}`,
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-gray-900">Reports &amp; Analytics</h1>
          <p className="text-xs text-gray-500 mt-1">
            Revenue analytics with daily, weekly &amp; monthly breakdowns — export to PDF/Excel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn-primary gap-2" onClick={() => onExport("pdf")}>
            <FileText size={14} />
            Export PDF
          </button>
          <button type="button" className="btn-primary gap-2" onClick={() => onExport("excel")}>
            <FileSpreadsheet size={14} />
            Export Excel
          </button>
        </div>
      </div>

      {/* ── Live KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          {
            label: "Revenue Collected",
            value: fmtINR(kpis.revenue),
            tone: "text-emerald-700 bg-emerald-50 border-emerald-100",
          },
          {
            label: "Outstanding Due",
            value: fmtINR(kpis.due),
            tone: "text-amber-700 bg-amber-50 border-amber-100",
          },
          {
            label: "Total Patients",
            value: kpis.patientCount.toLocaleString(),
            tone: "text-blue-700 bg-blue-50 border-blue-100",
          },
          {
            label: period === "daily" ? "Today Appointments" : "Total Appointments",
            value: kpis.appointmentCount.toLocaleString(),
            tone: "text-violet-700 bg-violet-50 border-violet-100",
          },
        ].map((kpi) => (
          <div key={kpi.label} className={`card p-4 border ${kpi.tone}`}>
            <div className="text-xs font-semibold uppercase tracking-wide">{kpi.label}</div>
            <div className="text-base font-bold mt-2">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ── Revenue Analytics Chart ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          padding: "24px",
        }}
      >
        {/* Chart Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                background: "linear-gradient(135deg,#10b981,#059669)",
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChart3 size={16} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>
                Revenue Analytics
              </h2>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                Revenue · Pending Dues · Refunds comparison
              </p>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Period Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CalendarDays size={14} color="#6b7280" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  fontSize: "14px",
                  color: "#374151",
                  background: "#f9fafb",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Grouped / Stacked toggle */}
            <div
              style={{
                display: "flex",
                background: "#f3f4f6",
                borderRadius: "8px",
                padding: "3px",
                gap: "2px",
              }}
            >
              {["grouped", "stacked"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setChartView(v)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: chartView === v ? "#fff" : "transparent",
                    color: chartView === v ? "#111827" : "#9ca3af",
                    boxShadow: chartView === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <SummaryPill icon={IndianRupee} label="Total Revenue"   value={fmtINR(totals.rev)}  colorKey="revenue" />
          <SummaryPill icon={AlertCircle}  label="Pending Dues"   value={fmtINR(totals.pend)} colorKey="pending" />
          <SummaryPill icon={RefreshCcw}   label="Total Refunds"  value={fmtINR(totals.ref)}  colorKey="refunds" />
        </div>

        {/* Chart */}
        <div style={{ height: "320px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, bottom: 5, left: 0 }}
              barCategoryGap="25%"
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickFormatter={(v) => {
                  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
                  if (v >= 1000)   return `₹${(v / 1000).toFixed(0)}k`;
                  return `₹${v}`;
                }}
                width={58}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0,0,0,0.03)", radius: 6 }}
              />

              {/* Revenue — Green */}
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill={COLORS.revenue.fill}
                radius={[5, 5, 0, 0]}
                maxBarSize={32}
                stackId={chartView === "stacked" ? "stack" : undefined}
                isAnimationActive={true}
                animationDuration={700}
                animationEasing="ease-out"
              />

              {/* Pending Dues — Amber/Orange */}
              <Bar
                dataKey="pending"
                name="Pending Dues"
                fill={COLORS.pending.fill}
                radius={chartView === "stacked" ? [0, 0, 0, 0] : [5, 5, 0, 0]}
                maxBarSize={32}
                stackId={chartView === "stacked" ? "stack" : undefined}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              />

              {/* Refunds — Red */}
              <Bar
                dataKey="refunds"
                name="Refunds"
                fill={COLORS.refunds.fill}
                radius={chartView === "stacked" ? [5, 5, 0, 0] : [5, 5, 0, 0]}
                maxBarSize={32}
                stackId={chartView === "stacked" ? "stack" : undefined}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <CustomLegend />
      </div>

      {/* ── KPI Dashboard ── */}
      <div className="card p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4">KPI Dashboard</h2>
        <div className="space-y-3 text-xs">
          {[
            {
              label: "Collection Efficiency",
              value:
                kpis.revenue + kpis.due > 0
                  ? `${Math.round((kpis.revenue / (kpis.revenue + kpis.due)) * 100)}%`
                  : "0%",
              color: "text-emerald-700",
            },
            {
              label: "Avg Revenue / Appointment",
              value: `₹${kpis.appointmentCount ? Math.round(kpis.revenue / kpis.appointmentCount).toLocaleString() : 0}`,
              color: "text-blue-700",
            },
            {
              label: "Patient to Appointment Ratio",
              value: kpis.patientCount
                ? (kpis.appointmentCount / kpis.patientCount).toFixed(2)
                : "0.00",
              color: "text-violet-700",
            },
            {
              label: "Net Revenue Indicator",
              value: `₹${Math.max(0, kpis.revenue - kpis.due).toLocaleString()}`,
              color: "text-emerald-700",
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-600">{row.label}</span>
              <span className={`font-semibold ${row.color}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
