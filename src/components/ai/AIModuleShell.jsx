import React from "react";
import { Link } from "react-router-dom";
import { useAI } from "../../context/AIContext";
import AIAlertsPanel from "./AIAlertsPanel";
import AIRecommendations from "./AIRecommendations";
import AIActivityFeed from "./AIActivityFeed";

/** Wrapper for AI pages — same spacing and surfaces as Main Menu pages */
const AIModuleShell = ({ children, showSidebar = true, moduleId }) => {
  const { alerts, activity, recommendations, dismissAlert } = useAI();

  const moduleRecs = moduleId
    ? recommendations.filter((r) => r.moduleId === moduleId)
    : recommendations;

  return (
    <div className="ai-module-page">
      {children}

      {showSidebar && (
        <div className="ai-grid-3 pt-2 ai-divider border-t">
          <AIAlertsPanel alerts={alerts} onDismiss={dismissAlert} compact />
          <AIRecommendations items={moduleRecs.length ? moduleRecs : recommendations.slice(0, 2)} />
          <AIActivityFeed items={activity} limit={5} />
        </div>
      )}

      <footer className="ai-module-footer">
        <span>Linked hospital modules:</span>
        <Link to="/patients">Patients</Link>
        <span>·</span>
        <Link to="/appointments">Appointments</Link>
        <span>·</span>
        <Link to="/billing">Billing</Link>
        <span>·</span>
        <Link to="/ai/insights">AI Insights Hub</Link>
      </footer>
    </div>
  );
};

export default AIModuleShell;
