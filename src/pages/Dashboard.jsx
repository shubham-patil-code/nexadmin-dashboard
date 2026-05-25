import React, { useMemo } from 'react';
import {
  Users,
  Calendar,
  UserCog,
  CreditCard,
  Package,
  BarChart3,
  Activity,
  IndianRupee,
  FlaskConical,
  Pill,
  AlertTriangle,
  BedDouble,
  UserPlus,
  FileText,
  Bell
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useCrudModule } from '../hooks/useCrudModule';

const patientFlowData = [
  { name: '15 May', opd: 600, ipd: 200 },
  { name: '16 May', opd: 700, ipd: 300 },
  { name: '17 May', opd: 500, ipd: 250 },
  { name: '18 May', opd: 800, ipd: 300 },
  { name: '19 May', opd: 750, ipd: 280 },
  { name: '20 May', opd: 600, ipd: 320 },
  { name: '21 May', opd: 850, ipd: 350 },
];

const revenueData = [
  { name: '15 May', revenue: 12 },
  { name: '16 May', revenue: 15 },
  { name: '17 May', revenue: 18 },
  { name: '18 May', revenue: 11 },
  { name: '19 May', revenue: 16 },
  { name: '20 May', revenue: 20 },
  { name: '21 May', revenue: 15 },
];

const departmentData = [
  { name: 'OPD', value: 35, color: '#3b82f6' },
  { name: 'IPD', value: 20, color: '#a855f7' },
  { name: 'Lab', value: 15, color: '#eab308' },
  { name: 'Pharmacy', value: 10, color: '#10b981' },
  { name: 'Radiology', value: 10, color: '#f97316' },
  { name: 'Others', value: 10, color: '#ef4444' },
];

const Sparkline = ({ color }) => (
  <svg className="w-full h-8 mt-4" viewBox="0 0 100 30" preserveAspectRatio="none">
    <path
      d="M0,25 C20,25 30,5 50,15 C70,25 80,10 100,5"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="100" cy="5" r="3" fill={color} />
  </svg>
);

const KPICard = ({ title, value, icon: Icon, trend, trendValue, colorClass, sparklineColor, iconColorClass }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon size={18} className={iconColorClass} />
      </div>
    </div>
    <p className="text-base font-bold text-gray-800">{value}</p>
    <div className="flex items-center gap-1 mt-1">
      <span className={`text-xs font-semibold ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend === 'up' ? '+' : '-'}{trendValue}
      </span>
      <span className="text-xs text-gray-400">from yesterday</span>
    </div>
    <Sparkline color={sparklineColor} />
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items: patients } = useCrudModule("patients");
  const { items: appointments } = useCrudModule("appointments");
  const { items: billing } = useCrudModule("billing");
  const { createItem: createNotification } = useCrudModule("notifications");

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const reports = useMemo(() => {
    const dailyRevenue = billing
      .filter((b) => (b.date || "") === todayIso)
      .reduce((sum, b) => sum + Number(b.paid || 0), 0);

    const totalPatients = patients.length;
    const activePatients = patients.filter((p) => (p.status || "") === "Active").length;

    const apptTrends = {};
    appointments.forEach((a) => {
      const d = a.date || "";
      if (!d) return;
      apptTrends[d] = (apptTrends[d] || 0) + 1;
    });
    const trendData = Object.keys(apptTrends)
      .sort()
      .slice(-7)
      .map((d) => ({ date: d.slice(5), appointments: apptTrends[d] }));

    return { dailyRevenue, totalPatients, activePatients, trendData };
  }, [appointments, billing, patients, todayIso]);

  const handleQuickAddPatient = () => {
    navigate('/patients?action=add');
  };

  const handleQuickBookAppointment = () => {
    navigate('/appointments?action=book');
  };

  const handleQuickGenerateReport = () => {
    navigate('/reports?period=daily&source=quick-actions');
  };

  const handleQuickSendReminder = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const todaysAppointments = appointments.filter(
      (appt) => appt.date === today && (appt.status === "Scheduled" || appt.status === "Rescheduled"),
    );
    if (todaysAppointments.length > 0) {
      await createNotification({
        title: "Appointment Reminder Batch",
        message: `Reminders sent for ${todaysAppointments.length} appointment(s) scheduled today.`,
        read: false,
      });
    }
    navigate('/notifications');
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900">Hospital Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Clean, modern overview of hospital operations and core modules.</p>
          <p className="text-sm mt-2 inline-flex bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
            Logged in as {user?.role || "user"} ({user?.name || "Unknown"})
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-700 uppercase tracking-wide">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={handleQuickAddPatient}
            className="flex items-center gap-3 p-3 hover:bg-blue-50/60 rounded-xl transition-all border border-transparent hover:border-blue-100 group"
          >
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
              <UserPlus size={18} />
            </div>
            <div className="text-left">
              <span className="text-base font-semibold text-gray-900 block">Add Patient</span>
              <span className="text-sm text-gray-500">Register new</span>
            </div>
          </button>
          <button
            type="button"
            onClick={handleQuickBookAppointment}
            className="flex items-center gap-3 p-3 hover:bg-teal-50/60 rounded-xl transition-all border border-transparent hover:border-teal-100 group"
          >
            <div className="bg-teal-50 text-teal-600 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
              <Calendar size={18} />
            </div>
            <div className="text-left">
              <span className="text-base font-semibold text-gray-900 block">Book Appointment</span>
              <span className="text-sm text-gray-500">Schedule visit</span>
            </div>
          </button>
          <button
            type="button"
            onClick={handleQuickGenerateReport}
            className="flex items-center gap-3 p-3 hover:bg-purple-50/60 rounded-xl transition-all border border-transparent hover:border-purple-100 group"
          >
            <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
              <FileText size={18} />
            </div>
            <div className="text-left">
              <span className="text-base font-semibold text-gray-900 block">Generate Report</span>
              <span className="text-sm text-gray-500">Daily summary</span>
            </div>
          </button>
          <button
            type="button"
            onClick={handleQuickSendReminder}
            className="flex items-center gap-3 p-3 hover:bg-orange-50/60 rounded-xl transition-all border border-transparent hover:border-orange-100 group"
          >
            <div className="bg-orange-50 text-orange-600 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
              <Bell size={18} />
            </div>
            <div className="text-left">
              <span className="text-base font-semibold text-gray-900 block">Send Reminder</span>
              <span className="text-sm text-gray-500">Notify patients</span>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="card p-5 border border-blue-100 bg-blue-50">
          <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">Daily revenue report</div>
          <div className="mt-2 text-base font-bold text-blue-900">₹{reports.dailyRevenue.toLocaleString()}</div>
          <div className="text-xs text-blue-700/80 mt-1">Collected today ({todayIso})</div>
        </div>
        <div className="card p-5 border border-emerald-100 bg-emerald-50">
  <div className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
    Patient statistics
  </div>

  <div className="mt-2 text-base font-bold text-emerald-900">
    {reports.totalPatients.toLocaleString()}
  </div>

  <div className="text-xs text-emerald-700/80 mt-1">
    {reports.activePatients.toLocaleString()} active
  </div>
</div>
        <div className="card p-5 border border-amber-100 bg-amber-50 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-amber-700">Appointment trends</div>
              <div className="text-xs text-amber-700/80 mt-1">Last 7 scheduled days</div>
            </div>
          </div>
          <div className="h-24 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reports.trendData}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="appointments" stroke="#d97706" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Patients" value="12,458" icon={Users} trend="up" trendValue="18.2%" colorClass="bg-blue-50" iconColorClass="text-blue-600" sparklineColor="#3b82f6" />
        <KPICard title="Today Appointments" value="256" icon={Calendar} trend="down" trendValue="12.5%" colorClass="bg-emerald-50" iconColorClass="text-emerald-600" sparklineColor="#10b981" />
        <KPICard title="Staff On Duty" value="178" icon={UserCog} trend="up" trendValue="3.1%" colorClass="bg-indigo-50" iconColorClass="text-indigo-600" sparklineColor="#4f46e5" />
        <KPICard title="Low Stock Items" value="14" icon={Package} trend="up" trendValue="6.0%" colorClass="bg-amber-50" iconColorClass="text-amber-600" sparklineColor="#f59e0b" />
        <KPICard title="Bed Occupancy" value="78.5%" icon={Activity} trend="up" trendValue="2.6%" colorClass="bg-teal-50" iconColorClass="text-teal-600" sparklineColor="#14b8a6" />
        <KPICard title="Revenue Today" value="₹ 8,45,230" icon={IndianRupee} trend="up" trendValue="20.4%" colorClass="bg-red-50" iconColorClass="text-red-600" sparklineColor="#ef4444" />
        <KPICard title="Pending Lab Reports" value="127" icon={FlaskConical} trend="up" trendValue="5.6%" colorClass="bg-yellow-50" iconColorClass="text-yellow-600" sparklineColor="#eab308" />
        <KPICard title="Pharmacy Sales" value="₹ 3,25,470" icon={Pill} trend="up" trendValue="14.8%" colorClass="bg-blue-50" iconColorClass="text-blue-600" sparklineColor="#3b82f6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Patient Flow</h2>
              <p className="text-sm text-gray-500">(This Week)</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientFlowData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="opd" name="OPD" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="ipd" name="IPD" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-gray-900">Revenue Overview</h2>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(value) => `${value}L`} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} formatter={(value) => [`${value} Lakhs`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-gray-900">Department Wise Activity</h2>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              <option>Today</option>
              <option>This Week</option>
            </select>
          </div>
          <div className="flex h-64 items-center">
            <div className="w-1/2 h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-xs font-bold text-gray-900">100%</span>
              </div>
            </div>
            <div className="w-1/2 pl-4 space-y-3">
              {departmentData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-semibold text-gray-900">Alerts & Notifications</h2>
            <Link to="/notifications" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1 text-red-500 bg-red-50 p-1.5 rounded-md"><AlertTriangle size={16} /></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Low Stock Alert: Paracetamol (500mg)</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">Only 50 strips left in Main Pharmacy</p>
                  <span className="text-xs text-gray-400 flex items-center gap-1">10 min ago <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span></span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-orange-500 bg-orange-50 p-1.5 rounded-md"><Activity size={16} /></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Emergency Alert</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">High patient inflow in Emergency Department</p>
                  <span className="text-xs text-gray-400 flex items-center gap-1">25 min ago <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span></span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-blue-500 bg-blue-50 p-1.5 rounded-md"><FlaskConical size={16} /></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Pending Lab Reports</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">127 reports are pending</p>
                  <span className="text-xs text-gray-400 flex items-center gap-1">30 min ago <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span></span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-teal-500 bg-teal-50 p-1.5 rounded-md"><BedDouble size={16} /></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Bed Occupancy Alert</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">ICU Occupancy is more than 90%</p>
                  <span className="text-xs text-gray-400 flex items-center gap-1">45 min ago <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-semibold text-gray-900">Today's Appointments</h2>
            <Link to="/appointments" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <tbody>
                <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium text-blue-600">09:00 AM</td>
                  <td className="py-3">
                    <p className="font-semibold text-gray-900">Rahul Sharma</p>
                    <p className="text-xs text-gray-500">OPD - Cardiology</p>
                  </td>
                  <td className="py-3 text-gray-700">Dr. Amit Verma</td>
                  <td className="py-3 text-right">
                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-medium">Completed</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium text-blue-600">09:30 AM</td>
                  <td className="py-3">
                    <p className="font-semibold text-gray-900">Priya Mehta</p>
                    <p className="text-xs text-gray-500">OPD - General</p>
                  </td>
                  <td className="py-3 text-gray-700">Dr. Neha Singh</td>
                  <td className="py-3 text-right">
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-medium">In Progress</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium text-blue-600">10:00 AM</td>
                  <td className="py-3">
                    <p className="font-semibold text-gray-900">Suresh Kumar</p>
                    <p className="text-xs text-gray-500">OPD - Orthopedics</p>
                  </td>
                  <td className="py-3 text-gray-700">Dr. Rohit Patel</td>
                  <td className="py-3 text-right">
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-medium">In Progress</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium text-blue-600">10:30 AM</td>
                  <td className="py-3">
                    <p className="font-semibold text-gray-900">Anjali Desai</p>
                    <p className="text-xs text-gray-500">OPD - Dermatology</p>
                  </td>
                  <td className="py-3 text-gray-700">Dr. Pooja Shah</td>
                  <td className="py-3 text-right">
                    <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-xs font-medium">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-semibold text-gray-900">Bed Occupancy Overview</h2>
              <Link to="/inventory" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">ICU</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">28/30</span>
                    <span className="font-semibold text-gray-900">93%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '93%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Private Rooms</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">45/60</span>
                    <span className="font-semibold text-gray-900">75%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">General Ward</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">120/180</span>
                    <span className="font-semibold text-gray-900">67%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Pediatrics</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">22/40</span>
                    <span className="font-semibold text-gray-900">55%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
