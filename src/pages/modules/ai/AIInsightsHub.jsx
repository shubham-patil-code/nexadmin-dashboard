import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Gauge,
  IndianRupee,
  TrendingUp,
  Users,
  Zap,
  RefreshCw,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AIPageHeader from "../../../components/common/AIPageHeader";
import AIModuleShell from "../../../components/ai/AIModuleShell";
import AIMetricCard from "../../../components/common/AIMetricCard";
import AIAlertsPanel from "../../../components/ai/AIAlertsPanel";
import AIActivityFeed from "../../../components/ai/AIActivityFeed";
import AIRecommendations from "../../../components/ai/AIRecommendations";
import { AILoadingState, AIErrorState } from "../../../components/ai/AIStateViews";
import { useAIInsights } from "../../../hooks/useAIModule";
import { useAI } from "../../../context/AIContext";
import AIStatusBadge from "../../../components/common/AIStatusBadge";

const AIInsightsHub = () => {
  const { dashboard, loading, error, reload } = useAIInsights({ refreshInterval: 30000 });
  const { alerts, activity, recommendations, realtime, dismissAlert, refreshGlobal } = useAI();

  if (loading && !dashboard) {
    return (
      <AIModuleShell showSidebar={false}>
        <AILoadingState message="Loading AI insights dashboard…" />
      </AIModuleShell>
    );
  }

  if (error) {
    return (
      <AIModuleShell showSidebar={false}>
        <AIErrorState message={error} onRetry={reload} />
      </AIModuleShell>
    );
  }

  const analytics = dashboard?.analytics || {};
  const moduleHealth = dashboard?.moduleHealth || [];

  return (
    <AIModuleShell showSidebar={false}>
      <AIPageHeader
        title="AI Insights Hub"
        description="Real-time analytics, cross-module alerts, activity tracking, and AI-generated recommendations"
        status="active"
        breadcrumbs={[{ label: "Ops & Analytics" }, { label: "AI Insights" }]}
        actions={
          <button
            type="button"
            className="ai-btn-primary inline-flex items-center gap-2"
            onClick={() => {
              reload();
              refreshGlobal();
            }}
          >
            <RefreshCw size={16} />
            Sync live data
          </button>
        }
      />

      {realtime && (
        <div className="ai-panel p-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-2 text-emerald-600 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live
          </span>
          <span>
            <strong className="text-slate-900">{realtime.activeSessions}</strong> active AI sessions
          </span>
          <span className="text-slate-300">·</span>
          <span>
            <strong className="text-slate-900">{realtime.eventsPerMinute}</strong> events/min
          </span>
          <span className="text-slate-300">·</span>
          <span>
            Model health <strong className="text-brand-600">{realtime.modelHealth?.toFixed(1)}%</strong>
          </span>
        </div>
      )}

      <div className="ai-grid-metrics">
        <AIMetricCard
          title="Automation Rate"
          value={`${analytics.automationRate}%`}
          icon={Zap}
          trend="up"
          trendValue="5.2%"
          sparklineColor="#60a5fa"
          sparkData={[65, 68, 70, 72, 75, 77, analytics.automationRate]}
        />
        <AIMetricCard
          title="Monthly Savings"
          value={`₹${(analytics.costSavings / 1000).toFixed(0)}K`}
          icon={IndianRupee}
          trend="up"
          trendValue="12%"
          sparklineColor="#34d399"
        />
        <AIMetricCard
          title="Patient Touchpoints"
          value={String(analytics.patientTouchpoints)}
          icon={Users}
          trend="up"
          trendValue="18%"
          sparklineColor="#3b82f6"
        />
        <AIMetricCard
          title="Escalation Rate"
          value={`${analytics.escalationRate}%`}
          icon={TrendingUp}
          trend="down"
          trendValue="1.1%"
          sparklineColor="#fbbf24"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 ai-panel p-4 md:p-5">
          <h3 className="ai-section-title mb-4">
            Weekly AI automation trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.weeklyTrend}>
                <defs>
                  <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#aiGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <AIAlertsPanel alerts={alerts.length ? alerts : dashboard?.alerts} onDismiss={dismissAlert} />
      </div>

      <div className="ai-grid-2">
        <AIRecommendations items={recommendations.length ? recommendations : dashboard?.recommendations} />
        <AIActivityFeed items={activity.length ? activity : dashboard?.activity} limit={10} />
      </div>

      <div className="ai-panel p-4 md:p-5">
        <h3 className="ai-section-title mb-4 flex items-center gap-2">
          <Gauge size={16} className="text-blue-400" />
          All AI modules — health status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {moduleHealth.map((mod) => (
            <Link
              key={mod.id}
              to={`/ai/${mod.id}`}
              className="summary-pill flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-brand-200 hover:bg-white transition-all duration-200"
            >
              <div className="min-w-0">
                <p className="text-sm text-slate-900 font-medium truncate">{mod.name}</p>
                <p className="text-xs text-slate-500">{mod.uptime}% uptime</p>
              </div>
              <AIStatusBadge status={mod.status} size="sm" />
            </Link>
          ))}
        </div>
      </div>

      <div className="ai-panel p-4 flex items-center gap-3 text-sm text-slate-600">
        <Activity size={18} className="text-brand-600" />
        AI modules are synchronized with Patients, Appointments, Billing, and Inventory workflows.
      </div>
    </AIModuleShell>
  );
};

export default AIInsightsHub;
