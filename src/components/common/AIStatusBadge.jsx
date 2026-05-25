import React from 'react';

const statusConfig = {
  active: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    pulse: true,
    label: 'Active',
  },
  processing: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    pulse: true,
    label: 'Processing',
  },
  idle: {
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    dot: 'bg-gray-400',
    pulse: false,
    label: 'Idle',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500',
    pulse: true,
    label: 'Error',
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    pulse: false,
    label: 'Warning',
  },
};

const AIStatusBadge = ({ status = 'active', label, size = 'sm' }) => {
  const config = statusConfig[status] || statusConfig.active;
  const displayLabel = label || config.label;

  const sizeClasses = size === 'lg'
    ? 'px-3 py-1.5 text-sm'
    : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      {displayLabel}
    </span>
  );
};

export default AIStatusBadge;
