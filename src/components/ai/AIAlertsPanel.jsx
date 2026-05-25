import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, X } from "lucide-react";
import AIGlassCard from "./AIGlassCard";

const severityStyles = {
  critical: "text-red-700 bg-red-50 border-red-100",
  warning: "text-amber-700 bg-amber-50 border-amber-100",
  info: "text-blue-700 bg-blue-50 border-blue-100",
};

const AIAlertsPanel = ({ alerts = [], onDismiss, title = "AI Alerts", compact = false }) => {
  const unread = alerts.filter((a) => !a.read);

  return (
    <AIGlassCard
      title={title}
      actions={
        unread.length > 0 ? (
          <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
            {unread.length} new
          </span>
        ) : null
      }
    >
      {alerts.length === 0 ? (
        <p className="text-sm text-slate-500 py-4 text-center">All clear — no active alerts</p>
      ) : (
        <ul className={`space-y-2 ${compact ? "max-h-48 overflow-y-auto custom-scrollbar" : ""}`}>
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={`rounded-lg border p-3 ${severityStyles[alert.severity] || severityStyles.info} ${
                alert.read ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-2 min-w-0">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                    {!compact && <p className="text-xs text-slate-500 mt-1">{alert.message}</p>}
                    <p className="text-[10px] text-slate-400 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
                {!alert.read && onDismiss && (
                  <button
                    type="button"
                    onClick={() => onDismiss(alert.id)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    aria-label="Dismiss alert"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {alert.moduleId && (
                <Link
                  to={`/ai/${alert.moduleId}`}
                  className="text-xs text-brand-600 hover:underline mt-2 inline-block font-medium"
                >
                  View module →
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </AIGlassCard>
  );
};

export default AIAlertsPanel;
