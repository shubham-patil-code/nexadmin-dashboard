import React, { useState } from 'react';
import './Sidebar.css';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCog,
  CreditCard,
  Package,
  BarChart3,
  Bell,
  LogOut,
  Activity,
  HeadphonesIcon,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Stethoscope,
  IndianRupee,
  Settings,
  Bot,
  MessageSquare,
  Phone,
  HelpCircle,
  FileText,
  ScanLine,
  FolderSearch,
  ShieldCheck,
  Receipt,
  TrendingUp,
  FileBarChart,
  BedDouble,
  BarChart2,
  SmilePlus,
  Gauge,
  Cog,
  BellRing,
  Workflow,
  Plug,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBadges } from '../../context/BadgeContext';
import { AI_ALLOWED_ROLES } from '../../context/AIContext';

/* ── Core (flat) nav items ─────────────────────────────────── */
const coreItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Patients', icon: Users, path: '/patients' },
  { name: 'Appointments', icon: CalendarDays, path: '/appointments', badgeKey: 'appointments' },
  { name: 'Doctors & Staff', icon: UserCog, path: '/staff' },
  { name: 'Billing', icon: CreditCard, path: '/billing', roles: ['superadmin', 'admin'] },
  { name: 'Inventory', icon: Package, path: '/inventory', badgeKey: 'inventory', roles: ['superadmin', 'admin'] },
  { name: 'Reports', icon: BarChart3, path: '/reports', badgeKey: 'reports' },
  { name: 'Notifications', icon: Bell, path: '/notifications', badgeKey: 'notifications' },
];

/* ── AI section groups ─────────────────────────────────────── */
const aiSections = [
  {
    id: 'patient-mgmt',
    label: 'Patient Management',
    icon: Users,
    items: [
      { name: 'AI Appointments', icon: CalendarCheck, path: '/ai/appointments' },
      { name: 'Follow-ups', icon: CalendarDays, path: '/ai/followups' },
      { name: 'AI Chatbot', icon: Bot, path: '/ai/chatbot' },
      { name: 'WhatsApp Auto', icon: MessageSquare, path: '/ai/whatsapp' },
      { name: 'Voice Reminders', icon: Phone, path: '/ai/voice-reminders' },
      { name: 'FAQ Bot', icon: HelpCircle, path: '/ai/faq-bot' },
    ],
  },
  {
    id: 'clinical-mgmt',
    label: 'Clinical Management',
    icon: Stethoscope,
    items: [
      { name: 'Prescription AI', icon: FileText, path: '/ai/prescriptions' },
      { name: 'OCR Scanner', icon: ScanLine, path: '/ai/ocr-scanner' },
      { name: 'Patient Records', icon: FolderSearch, path: '/ai/patient-records' },
      { name: 'Claim Verification', icon: ShieldCheck, path: '/ai/claims' },
    ],
  },
  {
    id: 'financial-mgmt',
    label: 'Financial Management',
    icon: IndianRupee,
    items: [
      { name: 'Billing AI', icon: Receipt, path: '/ai/billing' },
      { name: 'Revenue Forecast', icon: TrendingUp, path: '/ai/revenue-forecast' },
      { name: 'Smart Reports', icon: FileBarChart, path: '/ai/smart-reports' },
    ],
  },
  {
    id: 'ops-analytics',
    label: 'Ops & Analytics',
    icon: Activity,
    items: [
      { name: 'Bed Prediction', icon: BedDouble, path: '/ai/bed-prediction' },
      { name: 'Demand Forecast', icon: BarChart2, path: '/ai/demand-forecast' },
      { name: 'Sentiment', icon: SmilePlus, path: '/ai/sentiment' },
      { name: 'AI Insights', icon: Gauge, path: '/ai/insights' },
    ],
  },
  {
    id: 'ai-settings',
    label: 'AI Settings',
    icon: Settings,
    items: [
      { name: 'Configuration', icon: Cog, path: '/ai/configuration' },
      { name: 'Notif Settings', icon: BellRing, path: '/ai/notification-settings' },
      { name: 'Workflows', icon: Workflow, path: '/ai/workflow' },
      { name: 'Integrations', icon: Plug, path: '/ai/integrations' },
    ],
  },
];

/* ── Badge Pill ──────────────────────────────────────────── */
const BadgePill = ({ count, collapsed }) => {
  if (!count || count <= 0) return null;
  const display = count > 99 ? '99+' : count;

  return (
    <span
      className={[
        'sidebar-badge',
        collapsed ? 'sidebar-badge--collapsed' : '',
      ].join(' ')}
      aria-label={`${count} actionable items`}
    >
      {!collapsed && display}
      <span className="sidebar-badge__pulse" />
    </span>
  );
};

/* ── Sidebar Component ───────────────────────────────────── */
const Sidebar = ({ open, collapsed, onClose, onToggleCollapse }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { badges } = useBadges();

  const canAccessAI = AI_ALLOWED_ROLES.includes(user?.role);

  const initialExpanded = aiSections.reduce((acc, section) => {
    if (section.items.some((item) => location.pathname === item.path)) {
      acc[section.id] = true;
    }
    return acc;
  }, {});

  const [expandedSections, setExpandedSections] = useState(initialExpanded);

  const visibleCoreItems = coreItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role),
  );

  const visibleAiSections = canAccessAI ? aiSections : [];

  const isActivePath = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/';
    if (path.startsWith('/ai')) return location.pathname.startsWith(path) || location.pathname === path;
    return location.pathname === path;
  };

  const isSectionActive = (section) =>
    section.items.some(
      (item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`),
    );

  const toggleSection = (id) => {
    if (collapsed) return; // Don't toggle when sidebar is collapsed
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close sidebar"
        className={`fixed inset-0 bg-slate-900/50 z-30 md:hidden ${open ? 'block' : 'hidden'}`}
      />

      <aside
        className={[
          'sidebar-root',
          collapsed ? 'sidebar-root--collapsed' : 'sidebar-root--expanded',
          open ? 'sidebar-root--open' : 'sidebar-root--closed',
        ].join(' ')}
      >
        {/* Logo Area */}
        <div className="sidebar-header">
          <div className="sidebar-header__brand">
            <div className="sidebar-header__logo">
              <Activity size={24} />
            </div>
            <div className={collapsed ? 'hidden' : 'sidebar-header__text'}>
              <h1 className="sidebar-header__title">NexaCare</h1>
              <p className="sidebar-header__subtitle">Hospital Admin</p>
            </div>
          </div>

          <div className="sidebar-header__actions">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="sidebar-header__toggle hidden md:inline-flex"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="sidebar-header__close md:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Core Navigation */}
        {!collapsed && (
          <div className="sidebar-section-label">MAIN MENU</div>
        )}
        <nav className="sidebar-nav sidebar-nav--core">
          {visibleCoreItems.map((item) => {
            const isActive = isActivePath(item.path);
            const badgeCount = item.badgeKey ? (badges[item.badgeKey] || 0) : 0;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={[
                  'sidebar-nav__item',
                  isActive ? 'sidebar-nav__item--active' : '',
                ].join(' ')}
                title={collapsed ? `${item.name}${badgeCount ? ` (${badgeCount})` : ''}` : undefined}
              >
                <div className="sidebar-nav__item-left">
                  <div className={`sidebar-nav__icon ${isActive ? 'sidebar-nav__icon--active' : ''}`}>
                    <item.icon size={18} />
                  </div>
                  {!collapsed && (
                    <span className="sidebar-nav__label">{item.name}</span>
                  )}
                </div>
                <BadgePill count={badgeCount} collapsed={collapsed} />
              </Link>
            );
          })}
        </nav>

        {/* AI Divider — Admin & Super Admin only */}
        {canAccessAI && (
          <>
        <div className="sidebar-divider" />
        {!collapsed && (
          <div className="sidebar-section-label">
            <span className="flex items-center gap-1.5">
              <Sparkles size={11} className="text-violet-400" />
              AI MODULES
            </span>
          </div>
        )}

        {/* AI Sections */}
        <nav className="sidebar-nav sidebar-nav--ai">
          {visibleAiSections.map((section) => {
            const sectionActive = isSectionActive(section);
            const isExpanded = expandedSections[section.id] || sectionActive;

            return (
              <div key={section.id} className="sidebar-section">
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={[
                    'sidebar-section__header',
                    sectionActive ? 'sidebar-section__header--active' : '',
                  ].join(' ')}
                  title={collapsed ? section.label : undefined}
                >
                  <div className="sidebar-nav__item-left">
                    <div className={`sidebar-nav__icon ${sectionActive ? 'sidebar-nav__icon--active' : ''}`}>
                      <section.icon size={18} />
                    </div>
                    {!collapsed && (
                      <span className="sidebar-nav__label">{section.label}</span>
                    )}
                  </div>
                  {!collapsed && (
                    <ChevronDown
                      size={14}
                      className={`sidebar-section__chevron ${isExpanded ? 'sidebar-section__chevron--open' : ''}`}
                    />
                  )}
                </button>

                {/* Section Items */}
                {!collapsed && (
                  <div
                    className={[
                      'sidebar-section__items',
                      isExpanded ? 'sidebar-section__items--open' : '',
                    ].join(' ')}
                  >
                    {section.items.map((item) => {
                      const isActive = isActivePath(item.path);
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={onClose}
                          className={[
                            'sidebar-nav__item sidebar-nav__item--child',
                            isActive ? 'sidebar-nav__item--active' : '',
                          ].join(' ')}
                        >
                          <div className="sidebar-nav__item-left">
                            <div className={`sidebar-nav__icon sidebar-nav__icon--sm ${isActive ? 'sidebar-nav__icon--active' : ''}`}>
                              <item.icon size={14} />
                            </div>
                            <span className="sidebar-nav__label">{item.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
          </>
        )}

        {/* Divider */}
        <div className="sidebar-divider" />

        {/* Logout */}
        <div className="sidebar-footer-actions">
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="sidebar-nav__item sidebar-nav__item--logout"
            title={collapsed ? 'Logout' : undefined}
          >
            <div className="sidebar-nav__item-left">
              <div className="sidebar-nav__icon sidebar-nav__icon--logout">
                <LogOut size={18} />
              </div>
              {!collapsed && <span className="sidebar-nav__label">Logout</span>}
            </div>
          </button>
        </div>

        {/* Need Help Card */}
        {!collapsed && (
          <div className="sidebar-help">
            <div className="sidebar-help__card">
              <div className="sidebar-help__icon">
                <HeadphonesIcon size={20} />
              </div>
              <div className="sidebar-help__text">
                <p className="sidebar-help__title">Need Help?</p>
                <p className="sidebar-help__subtitle">Contact Support</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
