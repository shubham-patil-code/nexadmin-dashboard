import React from "react";
import { Link } from "react-router-dom";
import { Play, RefreshCw, Settings } from "lucide-react";

const AIActionBar = ({ moduleId, hospitalLinks = [], onRefresh, loading }) => (
  <div className="flex flex-wrap items-center gap-2">
    <button
      type="button"
      className="ai-btn-primary inline-flex items-center gap-2"
      onClick={() => {}}
      title="Run AI pipeline"
    >
      <Play size={16} />
      Run AI
    </button>
    <button
      type="button"
      className="ai-btn-ghost inline-flex items-center gap-2"
      onClick={onRefresh}
      disabled={loading}
    >
      <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
      Refresh
    </button>
    <Link to="/ai/configuration" className="ai-btn-ghost inline-flex items-center gap-2">
      <Settings size={16} />
      Settings
    </Link>
    {hospitalLinks.map((link) => (
      <Link key={link.path} to={link.path} className="ai-btn-ghost text-xs">
        {link.label}
      </Link>
    ))}
  </div>
);

export default AIActionBar;
