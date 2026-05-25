import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Search, Plus, ThumbsUp, Clock, BookOpen, Building2, CreditCard, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AIPageHeader from '../../../components/common/AIPageHeader';
import AIMetricCard from '../../../components/common/AIMetricCard';
import AIModuleShell from '../../../components/ai/AIModuleShell';

const queryStats = [
  { category: 'Appointments', queries: 245 },
  { category: 'Billing', queries: 180 },
  { category: 'Visiting', queries: 120 },
  { category: 'Departments', queries: 95 },
  { category: 'Insurance', queries: 85 },
  { category: 'Parking', queries: 60 },
  { category: 'Other', queries: 45 },
];

const faqCategories = [
  {
    id: 'appointments',
    name: 'Appointments',
    icon: Calendar,
    color: 'bg-blue-50 text-blue-600',
    count: 24,
    faqs: [
      { q: 'How do I book an appointment?', a: 'You can book via WhatsApp, website, or call our helpline at 1800-XXX-XXXX.', views: 1245 },
      { q: 'Can I reschedule my appointment?', a: 'Yes, rescheduling is available up to 2 hours before your slot.', views: 890 },
      { q: 'What is the cancellation policy?', a: 'Free cancellation up to 24 hours before. Late cancellations may incur a 10% fee.', views: 650 },
    ],
  },
  {
    id: 'departments',
    name: 'Department Info',
    icon: Building2,
    color: 'bg-purple-50 text-purple-600',
    count: 18,
    faqs: [
      { q: 'What departments are available?', a: 'We have 15+ departments including Cardiology, Orthopedics, Pediatrics, and more.', views: 980 },
      { q: 'How do I find the right department?', a: 'Our AI chatbot can guide you based on your symptoms to the right department.', views: 720 },
    ],
  },
  {
    id: 'visiting',
    name: 'Visiting Hours',
    icon: Clock,
    color: 'bg-emerald-50 text-emerald-600',
    count: 12,
    faqs: [
      { q: 'What are the visiting hours?', a: 'General ward: 10 AM - 12 PM & 4 PM - 6 PM. ICU: 11 AM - 12 PM only.', views: 2100 },
      { q: 'How many visitors are allowed?', a: 'Maximum 2 visitors per patient at a time. Children under 12 are not allowed in ICU.', views: 1560 },
    ],
  },
  {
    id: 'billing',
    name: 'Billing & Insurance',
    icon: CreditCard,
    color: 'bg-amber-50 text-amber-600',
    count: 20,
    faqs: [
      { q: 'What insurance providers are accepted?', a: 'We accept all major providers including Star Health, ICICI Lombard, and more.', views: 1890 },
      { q: 'How can I get my bill?', a: 'Bills are available at the billing counter or can be sent via WhatsApp/Email.', views: 1340 },
    ],
  },
];

const AIFAQBot = () => {
  const [selectedCategory, setSelectedCategory] = useState('appointments');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = faqCategories.find((c) => c.id === selectedCategory);

  return (
    <AIModuleShell moduleId="faq-bot">
      <AIPageHeader
        title="AI FAQ Support Bot"
        description="Automated patient query handling with intelligent knowledge base management"
        status="active"
        breadcrumbs={[{ label: 'Patient Management', path: '/ai/insights' }, { label: 'FAQ Bot' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AIMetricCard title="Queries Handled" value="830" icon={MessageSquare} trend="up" trendValue="18%" sparklineColor="#3b82f6" sparkData={[550, 600, 650, 700, 750, 800, 830]} />
        <AIMetricCard title="Resolution Rate" value="96.5%" icon={ThumbsUp} trend="up" trendValue="1.2%" sparklineColor="#10b981" sparkData={[93, 94, 94.5, 95, 95.5, 96, 96.5]} />
        <AIMetricCard title="Avg Response" value="0.8s" icon={Clock} trend="down" trendValue="0.2s" sparklineColor="#a855f7" sparkData={[1.5, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8]} />
        <AIMetricCard title="Knowledge Base" value="74 FAQs" icon={BookOpen} trend="up" trendValue="6 new" sparklineColor="#f59e0b" sparkData={[55, 58, 60, 63, 66, 70, 74]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Distribution Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Query Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={queryStats} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} width={80} />
                <Tooltip />
                <Bar dataKey="queries" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FAQ Knowledge Base */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Knowledge Base</h3>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..." className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-48" />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {faqCategories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                <cat.icon size={12} />
                {cat.name}
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-200'}`}>{cat.count}</span>
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {activeCategory?.faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <HelpCircle size={14} className="text-blue-500 flex-shrink-0" />
                      <p className="font-semibold text-sm text-gray-900">{faq.q}</p>
                    </div>
                    <p className="text-xs text-gray-600 ml-5 mt-1">{faq.a}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                    <Search size={10} />
                    {faq.views.toLocaleString()} views
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors">
            <Plus size={14} /> Add New FAQ
          </button>
        </div>
      </div>
    </AIModuleShell>
  );
};

export default AIFAQBot;
