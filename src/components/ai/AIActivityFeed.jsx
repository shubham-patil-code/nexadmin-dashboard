import React from "react";
import { Activity } from "lucide-react";
import AIGlassCard from "./AIGlassCard";

const typeColors = {
  booking: "bg-blue-50 text-blue-600",
  message: "bg-emerald-50 text-emerald-600",
  scan: "bg-violet-50 text-violet-600",
  forecast: "bg-amber-50 text-amber-600",
  insight: "bg-pink-50 text-pink-600",
};

const AIActivityFeed = ({ items = [], title = "Recent AI Activity", limit = 8 }) => {
  const visible = items.slice(0, limit);

  return (
    <AIGlassCard title={title}>
      {visible.length === 0 ? (
        <p className="text-sm text-slate-500 py-4 text-center">No recent activity</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm">
              <span className={`shrink-0 p-1.5 rounded-lg ${typeColors[item.type] || typeColors.insight}`}>
                <Activity size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-slate-800 leading-snug">{item.message}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AIGlassCard>
  );
};

export default AIActivityFeed;
