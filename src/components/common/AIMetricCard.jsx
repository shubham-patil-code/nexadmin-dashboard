import React from 'react';

const Sparkline = ({ color = '#3b82f6', data }) => {
  const points = data || [25, 15, 20, 10, 18, 8, 5];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const h = 30;
  const w = 100;
  const step = w / (points.length - 1);

  const pathD = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / range) * (h - 4) - 2;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  const lastX = (points.length - 1) * step;
  const lastY = h - ((points[points.length - 1] - min) / range) * (h - 4) - 2;
  const gradId = `grad-${String(color).replace('#', '')}`;

  return (
    <svg className="w-full h-8 mt-3" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${pathD} L${lastX},${h} L0,${h} Z`} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="3" fill={color} />
    </svg>
  );
};

/** KPI card — same styling as Dashboard KPICard */
const AIMetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  colorClass = 'bg-blue-50',
  iconColorClass = 'text-blue-600',
  sparklineColor = '#3b82f6',
  sparkData,
  aiPowered = true,
  subtitle,
}) => (
  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-soft hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
    {aiPowered && (
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-gradient-to-r from-violet-500/10 to-blue-500/10 text-violet-600 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-violet-200/40">
        <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0l2.1 5.3L16 6.2l-4.2 3.8L13 16 8 12.7 3 16l1.2-6L0 6.2l5.9-.9z" />
        </svg>
        AI
      </div>
    )}
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
      <div className={`p-2 rounded-lg ${colorClass} transition-transform duration-300 group-hover:scale-110`}>
        {Icon && <Icon size={18} className={iconColorClass} />}
      </div>
    </div>
    <p className="text-xl font-bold text-gray-800">{value}</p>
    {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    {trendValue && (
      <div className="flex items-center gap-1 mt-1">
        <span className={`text-xs font-semibold ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </span>
        <span className="text-xs text-gray-400">vs last period</span>
      </div>
    )}
    <Sparkline color={sparklineColor} data={sparkData} />
  </div>
);

export default AIMetricCard;
