import React from "react";
import { AlertTriangle, Inbox, Loader2, RefreshCw } from "lucide-react";

export function AILoadingState({ message = "Loading AI module data…" }) {
  return (
    <div className="ai-panel flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 mb-4" />
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
}

export function AIErrorState({ message, onRetry }) {
  return (
    <div className="ai-panel flex flex-col items-center justify-center py-16 px-6 text-center">
      <AlertTriangle className="w-10 h-10 text-amber-500 mb-4" />
      <h3 className="text-slate-900 font-semibold mb-1">Unable to load data</h3>
      <p className="text-slate-500 text-sm mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="ai-btn-primary inline-flex items-center gap-2">
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}

export function AIEmptyState({ title = "No data yet", description = "AI has not processed any records for this view.", action }) {
  return (
    <div className="ai-panel flex flex-col items-center justify-center py-16 px-6 text-center">
      <Inbox className="w-10 h-10 text-slate-400 mb-4" />
      <h3 className="text-slate-900 font-semibold mb-1">{title}</h3>
      <p className="text-slate-500 text-sm mb-4 max-w-md">{description}</p>
      {action}
    </div>
  );
}
