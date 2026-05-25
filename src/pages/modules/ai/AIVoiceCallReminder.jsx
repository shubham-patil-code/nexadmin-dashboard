import React from 'react';
import { Phone, PhoneCall, Clock, CheckCircle, AlertTriangle, Volume2, Calendar, Pill } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AIPageHeader from '../../../components/common/AIPageHeader';
import AIMetricCard from '../../../components/common/AIMetricCard';
import AIModuleShell from '../../../components/ai/AIModuleShell';

const callStats = [
  { day: 'Mon', completed: 85, failed: 5, pending: 10 },
  { day: 'Tue', completed: 92, failed: 3, pending: 5 },
  { day: 'Wed', completed: 78, failed: 8, pending: 14 },
  { day: 'Thu', completed: 95, failed: 2, pending: 3 },
  { day: 'Fri', completed: 88, failed: 6, pending: 6 },
  { day: 'Sat', completed: 45, failed: 3, pending: 2 },
  { day: 'Sun', completed: 30, failed: 2, pending: 3 },
];

const typeBreakdown = [
  { name: 'Appointment', value: 40, color: '#3b82f6' },
  { name: 'Medicine', value: 30, color: '#10b981' },
  { name: 'Follow-up', value: 20, color: '#a855f7' },
  { name: 'General', value: 10, color: '#f59e0b' },
];

const upcomingCalls = [
  { id: 1, patient: 'Rahul Sharma', type: 'Appointment', time: '11:00 AM', status: 'scheduled', message: 'Reminder for Dr. Verma appointment tomorrow at 10:30 AM' },
  { id: 2, patient: 'Priya Mehta', type: 'Medicine', time: '12:00 PM', status: 'scheduled', message: 'Evening medicine reminder: Amlodipine 5mg' },
  { id: 3, patient: 'Suresh Kumar', type: 'Follow-up', time: '01:30 PM', status: 'scheduled', message: 'Post-surgery follow-up due in 2 days' },
  { id: 4, patient: 'Anjali Desai', type: 'Appointment', time: '02:00 PM', status: 'in-progress', message: 'Reminder for lab test appointment' },
  { id: 5, patient: 'Vikram Rao', type: 'Medicine', time: '03:00 PM', status: 'scheduled', message: 'Morning medicine reminder: Metformin 500mg' },
  { id: 6, patient: 'Meena Patel', type: 'Follow-up', time: '04:00 PM', status: 'scheduled', message: 'Recovery checkup scheduled next week' },
];

const typeIcons = { Appointment: Calendar, Medicine: Pill, 'Follow-up': Phone, General: Volume2 };

const AIVoiceCallReminder = () => {
  return (
    <AIModuleShell moduleId="voice-reminders">
      <AIPageHeader
        title="AI Voice Call Reminder"
        description="Automated voice reminders for appointments, medicines, and follow-up notifications"
        status="active"
        breadcrumbs={[{ label: 'Patient Management', path: '/ai/insights' }, { label: 'Voice Reminders' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AIMetricCard title="Calls Today" value="156" icon={PhoneCall} trend="up" trendValue="12%" sparklineColor="#3b82f6" sparkData={[100, 110, 120, 130, 140, 148, 156]} />
        <AIMetricCard title="Completion Rate" value="92.4%" icon={CheckCircle} trend="up" trendValue="1.8%" sparklineColor="#10b981" sparkData={[88, 89, 90, 90.5, 91, 92, 92.4]} />
        <AIMetricCard title="Avg Call Duration" value="45s" icon={Clock} trend="down" trendValue="5s" sparklineColor="#a855f7" sparkData={[55, 52, 50, 48, 47, 46, 45]} subtitle="Optimized by AI" />
        <AIMetricCard title="Failed Calls" value="8" icon={AlertTriangle} trend="down" trendValue="40%" sparklineColor="#ef4444" sparkData={[18, 15, 14, 12, 10, 9, 8]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Stats Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Weekly Call Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={callStats} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[3, 3, 0, 0]} stackId="a" barSize={20} />
                <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[0, 0, 0, 0]} stackId="a" barSize={20} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[3, 3, 0, 0]} stackId="a" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Call Type Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {typeBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {typeBreakdown.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-gray-600">{t.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Calls Queue */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Upcoming Voice Calls</h3>
        <div className="grid gap-3">
          {upcomingCalls.map((call) => {
            const TypeIcon = typeIcons[call.type] || Phone;
            return (
              <div key={call.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${call.status === 'in-progress' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    <TypeIcon size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{call.patient}</p>
                    <p className="text-xs text-gray-500">{call.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 font-medium">{call.time}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${call.status === 'in-progress' ? 'bg-emerald-50 text-emerald-600 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                    {call.status === 'in-progress' ? '● In Progress' : 'Scheduled'}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                    {call.status === 'in-progress' ? 'View' : 'Call Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AIModuleShell>
  );
};

export default AIVoiceCallReminder;
