import React, { useState } from 'react';
import { Bot, MessageSquare, Clock, CheckCircle, TrendingUp, Send, User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import AIPageHeader from '../../../components/common/AIPageHeader';
import AIMetricCard from '../../../components/common/AIMetricCard';
import AIModuleShell from '../../../components/ai/AIModuleShell';

const topicData = [
  { name: 'Appointments', value: 35, color: '#3b82f6' },
  { name: 'Billing', value: 20, color: '#a855f7' },
  { name: 'Symptoms', value: 18, color: '#10b981' },
  { name: 'Lab Reports', value: 15, color: '#f59e0b' },
  { name: 'General', value: 12, color: '#ef4444' },
];

const hourlyData = [
  { hour: '00', chats: 12 }, { hour: '04', chats: 8 }, { hour: '08', chats: 45 },
  { hour: '10', chats: 68 }, { hour: '12', chats: 52 }, { hour: '14', chats: 60 },
  { hour: '16', chats: 55 }, { hour: '18', chats: 40 }, { hour: '20', chats: 30 },
  { hour: '22', chats: 18 },
];

const mockChat = [
  { from: 'patient', text: 'Hi, I would like to book an appointment with Dr. Verma.', time: '10:32 AM' },
  { from: 'bot', text: "Hello! I'd be happy to help you book an appointment with Dr. Amit Verma (Cardiology). He has available slots tomorrow at 10:30 AM and 2:00 PM. Which works best for you?", time: '10:32 AM' },
  { from: 'patient', text: '10:30 AM would be perfect.', time: '10:33 AM' },
  { from: 'bot', text: "Great! I've booked your appointment with Dr. Amit Verma for tomorrow at 10:30 AM. You'll receive a confirmation on WhatsApp shortly. Is there anything else I can help with?", time: '10:33 AM' },
  { from: 'patient', text: 'Can you tell me what documents I need to bring?', time: '10:34 AM' },
  { from: 'bot', text: "For your cardiology consultation, please bring:\n• Previous medical reports\n• Current medications list\n• Insurance card (if applicable)\n• Photo ID\n\nPlease arrive 15 minutes early for registration.", time: '10:34 AM' },
];

const AIChatbot = () => {
  const [message, setMessage] = useState('');

  return (
    <AIModuleShell moduleId="chatbot">
      <AIPageHeader
        title="AI Chatbot for Patients"
        description="24/7 AI-powered patient support with appointment booking, symptom guidance, and hospital info"
        status="active"
        breadcrumbs={[{ label: 'Patient Management', path: '/ai/insights' }, { label: 'AI Chatbot' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AIMetricCard title="Active Conversations" value="47" icon={MessageSquare} trend="up" trendValue="18%" sparklineColor="#3b82f6" sparkData={[30, 35, 38, 40, 42, 45, 47]} />
        <AIMetricCard title="Resolved Today" value="186" icon={CheckCircle} trend="up" trendValue="22%" sparklineColor="#10b981" sparkData={[120, 135, 140, 155, 160, 175, 186]} />
        <AIMetricCard title="Avg Response Time" value="1.2s" icon={Clock} trend="down" trendValue="0.3s" sparklineColor="#a855f7" sparkData={[2.5, 2.1, 1.8, 1.6, 1.5, 1.3, 1.2]} subtitle="Faster than yesterday" />
        <AIMetricCard title="Satisfaction Rate" value="94.8%" icon={TrendingUp} trend="up" trendValue="2.1%" sparklineColor="#f59e0b" sparkData={[89, 90, 91, 92, 93, 94, 94.8]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Chat Preview */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm col-span-1 lg:col-span-2 flex flex-col" style={{ maxHeight: '480px' }}>
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">NexaCare AI Assistant</h3>
              <p className="text-xs text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online — Handling 47 conversations</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
            {mockChat.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'patient' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${msg.from === 'patient' ? 'order-1' : ''}`}>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                    msg.from === 'patient'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  <p className={`text-[10px] mt-1 ${msg.from === 'patient' ? 'text-right' : ''} text-gray-400`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100 flex gap-3">
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"><Send size={16} /></button>
          </div>
        </div>

        {/* Analytics Side */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Topic Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={topicData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                    {topicData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {topicData.map((t, i) => (
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

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Hourly Chat Volume</h3>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="chats" fill="#a855f7" radius={[3, 3, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AIModuleShell>
  );
};

export default AIChatbot;
