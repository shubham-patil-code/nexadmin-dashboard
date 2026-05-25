import React from "react";

const AIGlassCard = ({ title, subtitle, actions, children, className = "" }) => (
  <div className={`ai-panel p-4 md:p-5 ${className}`}>
    {(title || actions) && (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          {title && <h3 className="ai-section-title">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);

export default AIGlassCard;
