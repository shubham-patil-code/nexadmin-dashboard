import React, { useState } from 'react';
import { CalendarCheck, UserCheck, AlertTriangle, Heart, Clock, MessageCircle, Phone } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AIPageHeader from '../../../components/common/AIPageHeader';
import AIMetricCard from '../../../components/common/AIMetricCard';
import AIModuleShell from '../../../components/ai/AIModuleShell';

const recoveryData = [
  { day: 'Day 1', score: 30 }, { day: 'Day 3', score: 45 }, { day: 'Day 5', score: 55 },
  { day: 'Day 7', score: 65 }, { day: 'Day 10', score: 72 }, { day: 'Day 14', score: 85 },
  { day: 'Day 21', score: 92 }, { day: 'Day 30', score: 96 },
];

const followUps = [
  { id: 1, patient: 'Rahul Sharma', procedure: 'Cardiac Surgery', dueDate: '2025-05-22', status: 'overdue', recovery: 72, channel: 'WhatsApp' },
  { id: 2, patient: 'Priya Mehta', procedure: 'Knee Replacement', dueDate: '2025-05-23', status: 'today', recovery: 85, channel: 'Call' },
  { id: 3, patient: 'Suresh Kumar', procedure: 'General Checkup', dueDate: '2025-05-24', status: 'upcoming', recovery: 96, channel: 'SMS' },
  { id: 4, patient: 'Anjali Desai', procedure: 'Eye Surgery', dueDate: '2025-05-25', status: 'upcoming', recovery: 90, channel: 'Email' },
  { id: 5, patient: 'Vikram Rao', procedure: 'Dental Implant', dueDate: '2025-05-21', status: 'overdue', recovery: 60, channel: 'Call' },
  { id: 6, patient: 'Meena Patel', procedure: 'Appendectomy', dueDate: '2025-05-23', status: 'today', recovery: 78, channel: 'WhatsApp' },
];

const statusConfig = {
  overdue: { bg: 'bg-red-50', text: 'text-red-600', label: 'Overdue' },
  today: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Due Today' },
  upcoming: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Upcoming' },
};

const AIFollowUpAutomation = () => {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? followUps : followUps.filter((f) => f.status === filter);

  return (
    <AIModuleShell moduleId="followups">
      <AIPageHeader
        title="AI Patient Follow-up Automation"
        description="Automated scheduling, recovery tracking, and personalized patient engagement"
        status="active"
        breadcrumbs={[{ label: 'Patient Management', path: '/ai/insights' }, { label: 'Follow-ups' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AIMetricCard title="Follow-ups Scheduled" value="234" icon={CalendarCheck} trend="up" trendValue="15%" sparklineColor="#3b82f6" sparkData={[20, 22, 25, 24, 28, 30, 34]} />
        <AIMetricCard title="Completed Today" value="18" icon={UserCheck} trend="up" trendValue="8%" sparklineColor="#10b981" sparkData={[12, 14, 13, 15, 16, 17, 18]} />
        <AIMetricCard title="Missed Alerts" value="5" icon={AlertTriangle} trend="down" trendValue="22%" sparklineColor="#ef4444" sparkData={[12, 10, 8, 9, 7, 6, 5]} />
        <AIMetricCard title="Avg Recovery Score" value="87%" icon={Heart} trend="up" trendValue="3.2%" sparklineColor="#a855f7" sparkData={[78, 80, 82, 83, 85, 86, 87]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recovery Tracking Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 col-span-1">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Average Recovery Trajectory</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recoveryData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[0, 100]} />
                <Tooltip formatter={(v) => [`${v}%`, 'Recovery']} />
                <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Follow-up List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Follow-up Queue</h3>
            <div className="flex gap-2">
              {['all', 'overdue', 'today', 'upcoming'].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filtered.map((item) => {
              const sc = statusConfig[item.status];
              return (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                      {item.patient.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.patient}</p>
                      <p className="text-xs text-gray-500">{item.procedure}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Recovery</p>
                      <div className="flex items-center gap-1">
                        <div className="w-12 bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${item.recovery >= 80 ? 'bg-emerald-500' : item.recovery >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${item.recovery}%` }} />
                        </div>
                        <span className="text-xs font-semibold">{item.recovery}%</span>
                      </div>
                    </div>
                    <span className={`${sc.bg} ${sc.text} px-2 py-0.5 rounded-full text-xs font-medium`}>{sc.label}</span>
                    <div className="flex items-center gap-1 text-gray-400">
                      {item.channel === 'Call' ? <Phone size={14} /> : item.channel === 'WhatsApp' ? <MessageCircle size={14} /> : <Clock size={14} />}
                      <span className="text-xs">{item.channel}</span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">Send</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AIModuleShell>
  );
};

export default AIFollowUpAutomation;
