import React from 'react';
import { MessageSquare, Check, Clock, Send, Eye, MessageCircle, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import AIPageHeader from '../../../components/common/AIPageHeader';
import AIMetricCard from '../../../components/common/AIMetricCard';
import AIModuleShell from '../../../components/ai/AIModuleShell';

const deliveryData = [
  { day: 'Mon', sent: 120, delivered: 115, read: 98 },
  { day: 'Tue', sent: 145, delivered: 140, read: 118 },
  { day: 'Wed', sent: 130, delivered: 126, read: 108 },
  { day: 'Thu', sent: 155, delivered: 150, read: 130 },
  { day: 'Fri', sent: 168, delivered: 162, read: 145 },
  { day: 'Sat', sent: 90, delivered: 87, read: 72 },
  { day: 'Sun', sent: 75, delivered: 72, read: 60 },
];

const templates = [
  { id: 1, name: 'Appointment Confirmation', type: 'Transactional', status: 'active', sent: 1245, deliveryRate: 98.2 },
  { id: 2, name: 'Appointment Reminder (24h)', type: 'Reminder', status: 'active', sent: 890, deliveryRate: 97.8 },
  { id: 3, name: 'Lab Report Ready', type: 'Notification', status: 'active', sent: 567, deliveryRate: 96.5 },
  { id: 4, name: 'Medicine Reminder', type: 'Reminder', status: 'active', sent: 423, deliveryRate: 95.9 },
  { id: 5, name: 'Billing Invoice', type: 'Transactional', status: 'paused', sent: 312, deliveryRate: 97.1 },
  { id: 6, name: 'Follow-up Scheduled', type: 'Notification', status: 'active', sent: 678, deliveryRate: 98.5 },
  { id: 7, name: 'FAQ Auto Reply', type: 'Auto-Reply', status: 'active', sent: 1890, deliveryRate: 99.1 },
];

const recentMessages = [
  { patient: 'Rahul S.', message: 'Your appointment with Dr. Verma is confirmed for tomorrow at 10:30 AM.', time: '2 min ago', status: 'delivered' },
  { patient: 'Priya M.', message: 'Reminder: Your lab report is ready for collection at the reception.', time: '8 min ago', status: 'read' },
  { patient: 'Suresh K.', message: 'Time for your evening medicine: Metformin 500mg. Stay healthy!', time: '15 min ago', status: 'read' },
  { patient: 'Anjali D.', message: 'Your follow-up appointment has been scheduled for May 28, 2025.', time: '22 min ago', status: 'delivered' },
];

const AIWhatsAppAutoReply = () => {
  return (
    <AIModuleShell moduleId="whatsapp">
      <AIPageHeader
        title="AI WhatsApp Auto Reply"
        description="Instant patient responses, appointment confirmations, automated reminders, and FAQ replies"
        status="active"
        breadcrumbs={[{ label: 'Patient Management', path: '/ai/insights' }, { label: 'WhatsApp Auto' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AIMetricCard title="Messages Sent Today" value="883" icon={Send} trend="up" trendValue="14%" sparklineColor="#25D366" sparkData={[600, 650, 700, 750, 800, 850, 883]} />
        <AIMetricCard title="Delivery Rate" value="97.8%" icon={Check} trend="up" trendValue="0.5%" sparklineColor="#3b82f6" sparkData={[96, 96.5, 97, 97.2, 97.5, 97.6, 97.8]} />
        <AIMetricCard title="Read Rate" value="84.3%" icon={Eye} trend="up" trendValue="3.2%" sparklineColor="#a855f7" sparkData={[78, 79, 80, 81, 82, 83, 84.3]} />
        <AIMetricCard title="Auto Replies" value="342" icon={MessageCircle} trend="up" trendValue="28%" sparklineColor="#f59e0b" sparkData={[200, 220, 250, 270, 290, 320, 342]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Stats Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Weekly Delivery Statistics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip />
                <Bar dataKey="sent" name="Sent" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={16} />
                <Bar dataKey="delivered" name="Delivered" fill="#10b981" radius={[3, 3, 0, 0]} barSize={16} />
                <Bar dataKey="read" name="Read" fill="#a855f7" radius={[3, 3, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Recent Messages</h3>
          <div className="space-y-3">
            {recentMessages.map((msg, i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-100 hover:bg-green-50/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-900">{msg.patient}</span>
                  <span className="text-[10px] text-gray-400">{msg.time}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{msg.message}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {msg.status === 'read' ? (
                    <><Check size={10} className="text-blue-500" /><Check size={10} className="text-blue-500 -ml-1.5" /><span className="text-[10px] text-blue-500">Read</span></>
                  ) : (
                    <><Check size={10} className="text-gray-400" /><Check size={10} className="text-gray-400 -ml-1.5" /><span className="text-[10px] text-gray-400">Delivered</span></>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Message Templates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 pr-4">Template Name</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Total Sent</th>
                <th className="pb-3 pr-4">Delivery Rate</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-3 pr-4 font-medium text-gray-900">{t.name}</td>
                  <td className="py-3 pr-4"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{t.type}</span></td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                      {t.status === 'active' ? '● Active' : '○ Paused'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-700">{t.sent.toLocaleString()}</td>
                  <td className="py-3 pr-4 font-semibold text-emerald-600">{t.deliveryRate}%</td>
                  <td className="py-3">
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AIModuleShell>
  );
};

export default AIWhatsAppAutoReply;
