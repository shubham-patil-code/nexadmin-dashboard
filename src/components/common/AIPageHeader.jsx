import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import AIStatusBadge from './AIStatusBadge';

const AIPageHeader = ({
  title,
  description,
  status = 'active',
  breadcrumbs = [],
  actions,
}) => (
  <div className="ai-page-header flex flex-col sm:flex-row sm:items-start justify-between gap-4">
    <div className="min-w-0">
      {breadcrumbs.length > 0 && (
        <nav className="ai-breadcrumb flex items-center gap-1 mb-3">
          <Link to="/dashboard" className="hover:text-gray-600 transition-colors">
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={14} />
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-gray-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl text-white ai-header-icon flex-shrink-0">
          <Sparkles size={20} />
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1>{title}</h1>
            <AIStatusBadge status={status} />
          </div>
          {description && <p>{description}</p>}
        </div>
      </div>
    </div>
    {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
  </div>
);

export default AIPageHeader;
