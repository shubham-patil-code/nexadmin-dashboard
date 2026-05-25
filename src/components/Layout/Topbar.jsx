import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, Bell, Mail, Menu, Command, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBadges } from '../../context/BadgeContext';
import { useCrudModule } from '../../hooks/useCrudModule';

const Topbar = ({ onMenuClick, onSidebarToggle, sidebarCollapsed }) => {
  const { user } = useAuth();
  const { badges, refreshBadges } = useBadges();

  // Notification dropdown handling
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const { items: notifItems, loading: notifLoading, refresh: refreshNotif, updateItem, deleteItem } = useCrudModule('notifications');

  // Mail dropdown handling (placeholder using same notifications data for demo)
  const [showMail, setShowMail] = useState(false);
  const mailRef = useRef(null);
  const { items: mailItems, loading: mailLoading, refresh: refreshMail, updateItem: updateMailItem, deleteItem: deleteMailItem } = useCrudModule('notifications'); // reuse notifications as mock mail

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showNotif && notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (showMail && mailRef.current && !mailRef.current.contains(e.target)) {
        setShowMail(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotif, showMail]);

  const markAsRead = async (id, currentRead, updater) => {
    if (!currentRead) {
      await updater(id, { read: true });
      await refreshBadges(); // update badge counts
    }
  };

  const renderDropdown = (items, loading, isMail) => (
    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-100 z-20">
      {loading ? (
        <div className="flex justify-center py-8 text-slate-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="p-4 text-center text-slate-500">No {isMail ? 'messages' : 'notifications'}.</div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-3 border-b last:border-b-0 ${item.read ? 'bg-slate-50' : ''}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {/* Icon based on type (only for notifications) */}
              {isMail ? (
                <Mail size={16} className="text-brand-600" />
              ) : (
                <Bell size={16} className="text-brand-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm text-slate-800">{item.title}</h4>
                <span className="text-xs text-slate-400">{item.timestamp || item.time}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{item.message || item.message}</p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                {!item.read && (
                  <button
                    onClick={async () => {
                      await markAsRead(item.id, item.read, isMail ? updateMailItem : updateItem);
                      // refresh local list
                      isMail ? await refreshMail() : await refreshNotif();
                    }}
                    className="text-brand-600 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={async () => {
                    await (isMail ? deleteMailItem(item.id) : deleteItem(item.id));
                    await refreshBadges();
                    isMail ? await refreshMail() : await refreshNotif();
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <header className="h-16 glass-card border-b border-white/70 flex items-center justify-between px-6 md:px-8 xl:px-14 2xl:px-20 sticky top-0 z-20 rounded-none">
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          onClick={onSidebarToggle}
          className="hidden md:inline-flex text-gray-500 hover:text-gray-700"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
        <button
          type="button"
          onClick={onMenuClick}
          className="text-gray-500 hover:text-gray-700 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="relative w-full max-w-xl hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search patients, appointments, doctors, modules..."
            className="input-control pl-10 pr-12"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-gray-200 px-1.5 py-0.5 rounded text-xs text-gray-400 font-medium shadow-sm">
            <Command size={12} /> K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-3 text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
          <Calendar size={16} className="text-gray-500" />
          <div className="flex flex-col">
            <span className="font-medium text-gray-700">21 May 2025</span>
            <span className="text-xs text-gray-500">Wednesday, 10:30 AM</span>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Notification Icon */}
          <button
            className="relative text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => {
              setShowNotif(!showNotif);
              setShowMail(false);
            }}
          >
            <Bell size={20} />
            {badges.notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                {badges.notifications}
              </span>
            )}
          </button>
          {/* Mail Icon */}
          <button
            className="relative text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => {
              setShowMail(!showMail);
              setShowNotif(false);
            }}
          >
            <Mail size={20} />
            {/* Placeholder mail badge – using same badge count for demo */}
            {badges.notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                {badges.notifications}
              </span>
            )}
          </button>
          {/* Dropdown panels */}
          {showNotif && (
            <div ref={notifRef} className="absolute right-0 top-full mt-2">
              {renderDropdown(notifItems, notifLoading, false)}
            </div>
          )}
          {showMail && (
            <div ref={mailRef} className="absolute right-0 top-full mt-2">
              {renderDropdown(mailItems, mailLoading, true)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Admin User"
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-gray-900">{user?.name || "User"}</span>
            <span className="text-xs text-gray-500">{user?.role || "Guest"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
