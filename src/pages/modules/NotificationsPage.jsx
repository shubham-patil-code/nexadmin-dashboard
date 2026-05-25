import { useState } from "react";
import { useCrudModule } from "../../hooks/useCrudModule";
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Trash2, Check, Clock } from "lucide-react";

export default function NotificationsPage() {
  const { items, loading, updateItem, deleteItem } = useCrudModule("notifications");
  const [filter, setFilter] = useState("all");

  const filtered = items
    .filter(item => filter === "all" ? true : !item.read)
    .sort((a, b) => {
      if (a.read === b.read) {
         return b.id.localeCompare(a.id);
      }
      return a.read ? 1 : -1;
    });

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'error': return <XCircle className="text-red-500" size={20} />;
      case 'success': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'info':
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBgColor = (type, read) => {
    if (read) return 'bg-slate-50 border-slate-100 opacity-70';
    switch (type) {
      case 'warning': return 'bg-amber-50 border-amber-100';
      case 'error': return 'bg-red-50 border-red-100';
      case 'success': return 'bg-emerald-50 border-emerald-100';
      case 'info':
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  const markAsRead = async (id, currentRead) => {
    if (!currentRead) {
      await updateItem(id, { read: true });
    }
  };

  const markAllAsRead = async () => {
    const unreadItems = items.filter(i => !i.read);
    for (const item of unreadItems) {
      await updateItem(item.id, { read: true });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell size={24} className="text-brand-600" />
            Notification Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Stay updated with real-time alerts, system messages, and announcements.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
             <button 
                onClick={() => setFilter('all')} 
                className={`px-4 py-1.5 rounded-md transition-colors ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                All
             </button>
             <button 
                onClick={() => setFilter('unread')} 
                className={`px-4 py-1.5 rounded-md transition-colors ${filter === 'unread' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Unread
             </button>
           </div>
           <button 
              onClick={markAllAsRead} 
              className="text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
           >
              <Check size={16} />
              Mark all read
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20 text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
             <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Bell size={32} className="text-slate-300" />
             </div>
             <p className="font-semibold text-slate-700 text-base">You're all caught up!</p>
             <p className="text-xs">No new notifications to display.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 sm:p-5 transition-colors border-l-4 ${!notification.read ? 'border-l-brand-500' : 'border-l-transparent'} ${getBgColor(notification.type, notification.read)} hover:bg-slate-50`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 p-2 rounded-full bg-white shadow-sm border border-slate-100 flex-shrink-0 ${notification.read ? 'opacity-60' : ''}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-1">
                      <h3 className={`font-semibold text-sm ${notification.read ? 'text-slate-600' : 'text-slate-900'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 whitespace-nowrap">
                        <Clock size={12} />
                        {notification.timestamp || "Just now"}
                      </div>
                    </div>
                    
                    <p className={`text-xs ${notification.read ? 'text-slate-500' : 'text-slate-600'} leading-relaxed`}>
                      {notification.message}
                    </p>
                    
                    <div className="mt-3 flex items-center gap-4">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id, notification.read)}
                          className="text-xs font-medium text-brand-600 hover:text-brand-800 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteItem(notification.id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <div className="w-2.5 h-2.5 bg-brand-500 rounded-full flex-shrink-0 shadow-sm shadow-brand-200" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
