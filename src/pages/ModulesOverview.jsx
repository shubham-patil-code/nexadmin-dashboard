import React from 'react';
import { 
  Layers, Calendar, Activity, IndianRupee, Bell, ShieldCheck, 
  Search, Users, Stethoscope, BedDouble, AlertTriangle, UserPlus, 
  FileText, Scissors, Pill, FlaskConical, Image as ImageIcon, ReceiptText, 
  ShieldAlert, Package, Users2, Building2, BarChart3, BrainCircuit, 
  Share2, MessageSquare, Settings, Smartphone, ArrowRight, UserPlus2, CalendarPlus, FileBarChart, BellRing
} from 'lucide-react';

const topCards = [
  { title: 'Total Modules', value: '24', subtext: 'Active Modules', icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Active Today', value: '23', subtext: '+95.8% vs yesterday', subtextHighlight: 'text-emerald-500 font-medium', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { title: 'Total Transactions', value: '8,247', subtext: 'Today', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
  { title: 'Total Revenue', value: '₹ 12,45,230', subtext: 'Today', icon: IndianRupee, color: 'text-orange-600', bg: 'bg-orange-50' },
  { title: 'Alerts', value: '18', subtext: 'Requires Attention', icon: Bell, color: 'text-teal-600', bg: 'bg-teal-50' },
  { title: 'System Status', value: 'Healthy', subtext: 'All systems operational', valueHighlight: 'text-emerald-500 flex items-center gap-2 before:content-[""] before:w-2 before:h-2 before:bg-emerald-500 before:rounded-full', icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50' },
];

const moduleCards = [
  { title: 'Patient Module', value: '12,458', subtext: 'Total Patients', trend: '+128 Today', trendColor: 'text-emerald-500', icon: Users, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { title: 'Appointment Module', value: '256', subtext: 'Today\'s Appointments', trend: '+12 Today', trendColor: 'text-emerald-500', icon: Calendar, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { title: 'OPD Module', value: '342', subtext: 'OPD Cases Today', trend: '+15.3%', trendColor: 'text-emerald-500', icon: Stethoscope, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
  { title: 'IPD Module', value: '48', subtext: 'Active Admissions', trend: '+8.4%', trendColor: 'text-emerald-500', icon: BedDouble, iconColor: 'text-orange-600', iconBg: 'bg-orange-50' },
  
  { title: 'Emergency Module', value: '35', subtext: 'Emergency Cases', trend: '+5 Today', trendColor: 'text-emerald-500', icon: AlertTriangle, iconColor: 'text-red-600', iconBg: 'bg-red-50' },
  { title: 'Doctor Module', value: '78', subtext: 'Active Doctors', trend: '', trendColor: '', icon: UserPlus, iconColor: 'text-teal-600', iconBg: 'bg-teal-50' },
  { title: 'Nursing Module', value: '126', subtext: 'Active Nursing Staff', trend: '', trendColor: '', icon: FileText, iconColor: 'text-pink-600', iconBg: 'bg-pink-50' },
  { title: 'OT / Surgery Module', value: '18', subtext: 'Surgeries Today', trend: '+2 Today', trendColor: 'text-emerald-500', icon: Scissors, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },

  { title: 'Pharmacy Module', value: '₹ 3,25,470', subtext: 'Sales Today', trend: '+14.8%', trendColor: 'text-emerald-500', icon: Pill, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { title: 'Lab Module', value: '127', subtext: 'Tests Today', trend: '+9.2%', trendColor: 'text-emerald-500', icon: FlaskConical, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
  { title: 'Radiology Module', value: '56', subtext: 'Scans Today', trend: '+7.1%', trendColor: 'text-emerald-500', icon: ImageIcon, iconColor: 'text-orange-600', iconBg: 'bg-orange-50' },
  { title: 'Billing Module', value: '₹ 8,45,230', subtext: 'Billing Today', trend: '+20.4%', trendColor: 'text-emerald-500', icon: ReceiptText, iconColor: 'text-teal-600', iconBg: 'bg-teal-50' },

  { title: 'Insurance / TPA', value: '23', subtext: 'Claims Today', trend: '+4 Today', trendColor: 'text-emerald-500', icon: ShieldAlert, iconColor: 'text-pink-600', iconBg: 'bg-pink-50' },
  { title: 'Inventory Module', value: '1,245', subtext: 'Items in Stock', trend: '', trendColor: '', icon: Package, iconColor: 'text-yellow-600', iconBg: 'bg-yellow-50' },
  { title: 'HR & Payroll', value: '156', subtext: 'Total Employees', trend: '', trendColor: '', icon: Users2, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { title: 'Finance Module', value: '₹ 18,75,230', subtext: 'Total Income', trend: '', trendColor: '', icon: IndianRupee, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },

  { title: 'Reports Module', value: '56', subtext: 'Reports Generated', trend: '+6 Today', trendColor: 'text-emerald-500', icon: BarChart3, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
  { title: 'AI Module', value: '12', subtext: 'AI Insights Today', trend: '+3 Today', trendColor: 'text-emerald-500', icon: BrainCircuit, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { title: 'Social Media Module', value: '8', subtext: 'Active Campaigns', trend: '', trendColor: '', icon: Share2, iconColor: 'text-red-600', iconBg: 'bg-red-50' },
  { title: 'Chat Support Module', value: '34', subtext: 'Active Chats', trend: '+7 Today', trendColor: 'text-emerald-500', icon: MessageSquare, iconColor: 'text-teal-600', iconBg: 'bg-teal-50' },

  { title: 'Settings Module', value: '24', subtext: 'Configurations', trend: '', trendColor: '', icon: Settings, iconColor: 'text-gray-600', iconBg: 'bg-gray-100' },
  { title: 'Mobile App Module', value: '1,245', subtext: 'App Users', trend: '', trendColor: '', icon: Smartphone, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' }
];

const ModulesOverview = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-gray-900">Modules Overview</h1>
        <p className="text-xs text-gray-500 mt-1">Real-time overview of all hospital modules and their activities.</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topCards.map((card, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon size={20} className={card.color} />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-blue-600 leading-tight">{card.title}</h3>
                <p className={`text-base font-bold mt-1 ${card.valueHighlight || 'text-gray-800'}`}>{card.value}</p>
              </div>
            </div>
            <p className={`text-xs text-gray-500 mt-auto ${card.subtextHighlight || ''}`}>
              {card.subtext}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Grid Area */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-gray-900">All Modules</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search module..." 
                  className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none">
                <option>All Modules</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {moduleCards.map((mod, idx) => (
              <div key={idx} className="bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all p-4 rounded-xl flex flex-col group">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg ${mod.iconBg}`}>
                    <mod.icon size={20} className={mod.iconColor} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{mod.title}</h3>
                    <p className="text-base font-bold text-gray-800 leading-none">{mod.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{mod.subtext}</p>
                  </div>
                </div>
                <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50">
                  <span className={`text-xs font-semibold ${mod.trendColor || 'text-transparent'}`}>
                    {mod.trend || '-'}
                  </span>
                  <button className="text-blue-600 text-xs font-medium flex items-center gap-1 group-hover:underline">
                    View Details <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          
          {/* System Alerts */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-semibold text-gray-900">System Alerts</h2>
              <a href="#" className="text-blue-600 text-xs font-medium hover:underline">View All</a>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-0.5 text-red-500 bg-red-50 p-1.5 rounded-md shrink-0"><AlertTriangle size={14} /></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-gray-900">Low Stock Alert</p>
                    <span className="text-xs text-gray-400 flex items-center gap-1">10 min ago <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span></span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">5 medicines are running low</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 text-orange-500 bg-orange-50 p-1.5 rounded-md shrink-0"><FlaskConical size={14} /></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-gray-900">Pending Lab Reports</p>
                    <span className="text-xs text-gray-400 flex items-center gap-1">20 min ago <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span></span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">127 reports are pending</p>
                </div>
              </div>
               <div className="flex gap-3">
                <div className="mt-0.5 text-red-500 bg-red-50 p-1.5 rounded-md shrink-0"><Activity size={14} /></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-gray-900">Emergency Alert</p>
                    <span className="text-xs text-gray-400 flex items-center gap-1">30 min ago <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span></span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">High patient inflow in ER</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 text-yellow-500 bg-yellow-50 p-1.5 rounded-md shrink-0"><BedDouble size={14} /></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-gray-900">Bed Occupancy High</p>
                    <span className="text-xs text-gray-400 flex items-center gap-1">40 min ago <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span></span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">ICU occupancy is 93%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Quick Stats */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Today's Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={14} className="text-blue-600" /> Total Patients
                </div>
                <span className="font-semibold text-gray-900">12,458</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <UserPlus size={14} className="text-emerald-600" /> New Patients
                </div>
                <span className="font-semibold text-gray-900">128</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <BedDouble size={14} className="text-teal-600" /> Discharged Today
                </div>
                <span className="font-semibold text-gray-900">25</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <AlertTriangle size={14} className="text-red-600" /> Deaths
                </div>
                <span className="font-semibold text-gray-900">2</span>
              </div>
               <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-600">
                  <IndianRupee size={14} className="text-pink-600" /> Total Revenue
                </div>
                <span className="font-semibold text-gray-900">₹ 12,45,230</span>
              </div>
            </div>
          </div>

          {/* Top Performing Modules */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-900">Top Performing Modules</h2>
              <select className="text-xs bg-gray-50 border border-gray-200 rounded px-1 py-0.5 focus:outline-none">
                <option>Today</option>
              </select>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Pharmacy</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-semibold">₹ 3,25,470</span>
                    <span className="text-gray-400">26%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div className="bg-emerald-500 h-1 rounded-full" style={{width: '26%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Lab</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-semibold">₹ 2,45,230</span>
                    <span className="text-gray-400">20%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div className="bg-purple-500 h-1 rounded-full" style={{width: '20%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Billing</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-semibold">₹ 8,45,230</span>
                    <span className="text-gray-400">68%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div className="bg-emerald-500 h-1 rounded-full" style={{width: '68%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-2">
               <button className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                <div className="text-blue-600 mb-1 group-hover:scale-110 transition-transform"><UserPlus2 size={16} /></div>
                <span className="text-xs text-gray-600 text-center font-medium leading-tight">Add Patient</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                <div className="text-teal-600 mb-1 group-hover:scale-110 transition-transform"><CalendarPlus size={16} /></div>
                <span className="text-xs text-gray-600 text-center font-medium leading-tight">Book Appt</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                <div className="text-purple-600 mb-1 group-hover:scale-110 transition-transform"><FileBarChart size={16} /></div>
                <span className="text-xs text-gray-600 text-center font-medium leading-tight">Gen Report</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                <div className="text-indigo-600 mb-1 group-hover:scale-110 transition-transform"><BellRing size={16} /></div>
                <span className="text-xs text-gray-600 text-center font-medium leading-tight">Send Notif</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModulesOverview;
