import React from "react";
import { Link } from "react-router-dom";
import { Lightbulb, ChevronRight } from "lucide-react";
import AIGlassCard from "./AIGlassCard";

const priorityStyles = {
  high: "border-l-red-500 bg-red-50/50",
  medium: "border-l-amber-500 bg-amber-50/50",
  low: "border-l-emerald-500 bg-emerald-50/50",
};

const AIRecommendations = ({ items = [], title = "AI Recommendations" }) => {
  if (!items.length) return null;

  return (
    <AIGlassCard title={title}>
      <ul className="space-y-3">
        {items.map((rec) => (
          <li
            key={rec.id}
            className={`border-l-4 rounded-r-lg p-3 ${priorityStyles[rec.priority] || priorityStyles.low}`}
          >
            <div className="flex items-start gap-2">
              <Lightbulb size={16} className="text-violet-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{rec.title}</p>
                <p className="text-xs text-slate-500 mt-1">{rec.description}</p>
                {rec.actionPath && (
                  <Link
                    to={rec.actionPath}
                    className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 mt-2 font-medium"
                  >
                    {rec.actionLabel || "View"} <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </AIGlassCard>
  );
};

export default AIRecommendations;
