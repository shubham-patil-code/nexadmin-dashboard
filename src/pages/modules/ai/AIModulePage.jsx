import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import AIPageHeader from "../../../components/common/AIPageHeader";
import AIModuleShell from "../../../components/ai/AIModuleShell";
import AIMetricCard from "../../../components/common/AIMetricCard";
import AIChartCard from "../../../components/ai/AIChartCard";
import AIDataTable from "../../../components/ai/AIDataTable";
import AIActionBar from "../../../components/ai/AIActionBar";
import { AILoadingState, AIErrorState, AIEmptyState } from "../../../components/ai/AIStateViews";
import { useAIModule } from "../../../hooks/useAIModule";
import { aiService } from "../../../services/api/aiService";
import {
  Calendar,
  MessageSquare,
  FileText,
  ScanLine,
  FolderSearch,
  ShieldCheck,
  Receipt,
  TrendingUp,
  FileBarChart,
  BedDouble,
  BarChart2,
  SmilePlus,
  Cog,
  BellRing,
  Workflow,
  Plug,
  Bot,
  Phone,
  HelpCircle,
  CalendarCheck,
  Gauge,
} from "lucide-react";

const iconMap = {
  prescriptions: FileText,
  "ocr-scanner": ScanLine,
  "patient-records": FolderSearch,
  claims: ShieldCheck,
  billing: Receipt,
  "revenue-forecast": TrendingUp,
  "smart-reports": FileBarChart,
  "bed-prediction": BedDouble,
  "demand-forecast": BarChart2,
  sentiment: SmilePlus,
  configuration: Cog,
  "notification-settings": BellRing,
  workflow: Workflow,
  integrations: Plug,
  appointments: CalendarCheck,
  followups: Calendar,
  chatbot: Bot,
  whatsapp: MessageSquare,
  "voice-reminders": Phone,
  "faq-bot": HelpCircle,
  insights: Gauge,
};

const metricIcons = [Sparkles, MessageSquare, TrendingUp, Calendar];

const AIModulePage = ({ moduleId }) => {
  const meta = aiService.getModuleMeta(moduleId);
  const { data, loading, error, isEmpty, reload } = useAIModule(moduleId, { refreshInterval: 60000 });
  const ModuleIcon = iconMap[moduleId] || Sparkles;

  const content = () => {
    if (loading) return <AILoadingState />;
    if (error) return <AIErrorState message={error} onRetry={reload} />;
    if (isEmpty) {
      return (
        <AIEmptyState
          title="No AI activity recorded"
          description={`${meta.title} has not processed any items in this period. Run the AI pipeline or check hospital module data.`}
          action={
            <button type="button" onClick={reload} className="ai-btn-primary">
              Refresh data
            </button>
          }
        />
      );
    }

    return (
      <>
        <div className="ai-grid-metrics">
          {data.metrics.map((m, i) => {
            const Icon = metricIcons[i % metricIcons.length];
            return (
              <AIMetricCard
                key={m.key}
                title={m.title}
                value={m.value}
                icon={Icon}
                trend={m.trend}
                trendValue={m.trendValue}
                sparkData={m.sparkData}
                sparklineColor={["#60a5fa", "#3b82f6", "#34d399", "#fbbf24"][i % 4]}
              />
            );
          })}
        </div>

        <div className="ai-grid-2">
          <AIChartCard
            title="Weekly AI Performance"
            data={data.chart}
            chartType={data.chartType}
            dataKey="value"
            secondaryKey="secondary"
          />
          <AIChartCard
            title="Secondary trend"
            data={data.chart}
            chartType={data.chartType === "bar" ? "line" : "bar"}
            dataKey="secondary"
          />
        </div>

        <div className="ai-panel p-4 md:p-5">
          <h3 className="ai-section-title mb-4">
            Recent AI-processed records
          </h3>
          <AIDataTable rows={data.table} />
        </div>
      </>
    );
  };

  return (
    <AIModuleShell moduleId={moduleId} showSidebar={!loading && !error}>
      <AIPageHeader
        title={meta.title}
        description={meta.description}
        status={data?.status || "active"}
        breadcrumbs={[
          { label: meta.section, path: "/ai/insights" },
          { label: meta.title.split(" ").slice(-2).join(" ") || meta.title },
        ]}
        actions={
          <AIActionBar
            moduleId={moduleId}
            hospitalLinks={data?.hospitalLinks}
            onRefresh={reload}
            loading={loading}
          />
        }
      />

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4">
        <ModuleIcon size={14} className="text-brand-600" />
        <span>Connected to hospital workflow</span>
        {data?.hospitalLinks?.map((l) => (
          <React.Fragment key={l.path}>
            <span>·</span>
            <Link to={l.path} className="text-brand-600 hover:underline font-medium">
              {l.label}
            </Link>
          </React.Fragment>
        ))}
      </div>

      {content()}
    </AIModuleShell>
  );
};

export default AIModulePage;
