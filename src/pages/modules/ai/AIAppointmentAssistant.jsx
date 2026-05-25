import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, AlertCircle, RefreshCw, Zap, Star } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AIPageHeader from '../../../components/common/AIPageHeader';
import AIMetricCard from '../../../components/common/AIMetricCard';
import AIModuleShell from '../../../components/ai/AIModuleShell';

const queueData = [
  { time: '08:00', wait: 12, patients: 8 },
  { time: '09:00', wait: 25, patients: 15 },
  { time: '10:00', wait: 38, patients: 22 },
  { time: '11:00', wait: 30, patients: 18 },
  { time: '12:00', wait: 15, patients: 10 },
  { time: '13:00', wait: 8, patients: 5 },
  { time: '14:00', wait: 20, patients: 14 },
  { time: '15:00', wait: 32, patients: 20 },
  { time: '16:00', wait: 22, patients: 12 },
];

const doctorSlots = [
  { name: 'Dr. Amit Verma', dept: 'Cardiology', available: 4, booked: 12, nextSlot: '10:30 AM', confidence: 95 },
  { name: 'Dr. Neha Singh', dept: 'General', available: 7, booked: 9, nextSlot: '09:00 AM', confidence: 88 },
  { name: 'Dr. Rohit Patel', dept: 'Orthopedics', available: 3, booked: 13, nextSlot: '11:00 AM', confidence: 92 },
  { name: 'Dr. Pooja Shah', dept: 'Dermatology', available: 6, booked: 10, nextSlot: '09:30 AM', confidence: 85 },
  { name: 'Dr. Suresh Kumar', dept: 'Pediatrics', available: 5, booked: 11, nextSlot: '10:00 AM', confidence: 90 },
];

const rescheduleQueue = [
  { id: 1, patient: 'Rahul Sharma', original: '10:00 AM', suggested: '02:30 PM', reason: 'Doctor delay', confidence: 94 },
  { id: 2, patient: 'Priya Mehta', original: '11:30 AM', suggested: '03:00 PM', reason: 'Slot conflict', confidence: 89 },
  { id: 3, patient: 'Amit Desai', original: '09:00 AM', suggested: '01:00 PM', reason: 'Emergency case', confidence: 97 },
  { id: 4, patient: 'Anjali Rao', original: '02:00 PM', suggested: '04:30 PM', reason: 'Patient request', confidence: 82 },
];

const AIAppointmentAssistant = () => {
  const [selectedTab, setSelectedTab] = useState('booking');

  return (
    <AIModuleShell moduleId="appointments">
      <AIPageHeader
        title="AI Appointment Assistant"
        description="Smart appointment booking, auto-rescheduling, and queue optimization powered by AI"
        status="active"
        breadcrumbs={[{ label: 'Patient Management', path: '/ai/insights' }, { label: 'AI Appointments' }]}
      />

      {/* Metric Cards */}
      <div className="ai-grid-metrics">
        <AIMetricCard title="AI Bookings Today" value="142" icon={Calendar} trend="up" trendValue="23%" sparklineColor="#3b82f6" sparkData={[8, 12, 15, 14, 18, 22, 20]} />
        <AIMetricCard title="Auto-Rescheduled" value="18" icon={RefreshCw} trend="up" trendValue="12%" sparklineColor="#a855f7" sparkData={[3, 5, 4, 7, 6, 8, 9]} />
        <AIMetricCard title="Avg Wait Time" value="14 min" icon={Clock} trend="down" trendValue="31%" sparklineColor="#10b981" sparkData={[25, 22, 20, 18, 16, 15, 14]} subtitle="↓ Reduced by AI optimization" />
        <AIMetricCard title="Queue Optimization" value="96.2%" icon={Zap} trend="up" trendValue="4.5%" sparklineColor="#f59e0b" sparkData={[88, 90, 91, 93, 94, 95, 96]} />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="border-b border-gray-100 px-5">
          <div className="flex gap-6">
            {['booking', 'rescheduling', 'queue'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                  selectedTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'booking' ? 'Smart Booking' : tab === 'rescheduling' ? 'Auto Rescheduling' : 'Queue Optimization'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {selectedTab === 'booking' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Doctor Availability & AI Suggestions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-3 pr-4">Doctor</th>
                      <th className="pb-3 pr-4">Department</th>
                      <th className="pb-3 pr-4">Available / Booked</th>
                      <th className="pb-3 pr-4">Next Slot</th>
                      <th className="pb-3 pr-4">AI Confidence</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorSlots.map((doc, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-4 font-medium text-gray-900">{doc.name}</td>
                        <td className="py-3 pr-4 text-gray-600">{doc.dept}</td>
                        <td className="py-3 pr-4">
                          <span className="text-emerald-600 font-semibold">{doc.available}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-gray-600">{doc.booked}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{doc.nextSlot}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-100 rounded-full h-1.5">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${doc.confidence}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{doc.confidence}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                            Book Slot
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedTab === 'rescheduling' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">AI Auto-Rescheduling Suggestions</h3>
              <div className="grid gap-3">
                {rescheduleQueue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                        {item.patient.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.patient}</p>
                        <p className="text-xs text-gray-500">{item.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Original</p>
                        <p className="font-medium text-red-500 line-through">{item.original}</p>
                      </div>
                      <RefreshCw size={14} className="text-gray-400" />
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Suggested</p>
                        <p className="font-medium text-emerald-600">{item.suggested}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                        <Star size={12} />
                        <span className="text-xs font-bold">{item.confidence}%</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">Accept</button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'queue' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Real-Time Queue & Wait Times</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={queueData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="wait" name="Wait (min)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24}>
                      {queueData.map((entry, index) => (
                        <Cell key={index} fill={entry.wait > 30 ? '#ef4444' : entry.wait > 20 ? '#f59e0b' : '#10b981'} />
                      ))}
                    </Bar>
                    <Bar dataKey="patients" name="Patients" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </AIModuleShell>
  );
};

export default AIAppointmentAssistant;
