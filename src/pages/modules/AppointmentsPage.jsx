import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Plus, RotateCcw, Ticket, XCircle, Search, Clock, User, UserCog,
  CheckCircle2, AlertCircle, CalendarClock, TrendingUp, Filter
} from "lucide-react";
import AppModal from "../../components/common/AppModal";
import FormField from "../../components/common/FormField";
import { useCrudModule } from "../../hooks/useCrudModule";
import { useSearchParams } from "react-router-dom";

const initialForm = {
  patient: "",
  doctor: "",
  department: "",
  date: "",
  time: "",
  reason: "",
  status: "Scheduled",
};

/* ─── Metric Card ─────────────────────────────────────────────── */
const MetricCard = ({ icon: Icon, label, value, color, bgColor, borderColor }) => (
  <div className={`flex items-center gap-3 p-4 rounded-xl border ${borderColor} ${bgColor} transition-all hover:shadow-sm`}>
    <div className={`p-2.5 rounded-lg ${color} bg-white/80 shadow-sm`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-base font-bold text-slate-900">{value}</p>
      <p className="text-xs font-medium text-slate-500 mt-0.5">{label}</p>
    </div>
  </div>
);

export default function AppointmentsPage() {
  const { items, loading, createItem, updateItem } = useCrudModule("appointments");
  const { items: patients } = useCrudModule("patients");
  const { items: staff } = useCrudModule("staff");
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState("daily");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [reschedule, setReschedule] = useState({ id: null, date: "", time: "" });
  const [openCancel, setOpenCancel] = useState(false);
  const [apptToCancel, setApptToCancel] = useState(null);

  const doctors = useMemo(() => staff.filter((m) => String(m.role || "").toLowerCase().includes("doctor")), [staff]);

  useEffect(() => {
    if (searchParams.get("action") === "book") {
      setOpen(true);
    }
  }, [searchParams]);

  /* ─── Metrics ───────────────────────────────────────────────── */
  const metrics = useMemo(() => {
    const total = items.length;
    const scheduled = items.filter((a) => a.status === "Scheduled" || a.status === "Rescheduled").length;
    const completed = items.filter((a) => a.status === "Completed").length;
    const cancelled = items.filter((a) => a.status === "Cancelled").length;
    const todayIso = new Date().toISOString().slice(0, 10);
    const today = items.filter((a) => a.date === todayIso && a.status !== "Cancelled").length;
    return { total, scheduled, completed, cancelled, today };
  }, [items]);

  /* ─── Filtering ─────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return items.filter((appt) => {
      const searchOk =
        !query ||
        String(appt.patient || "").toLowerCase().includes(query) ||
        String(appt.doctor || "").toLowerCase().includes(query) ||
        String(appt.id || "").toLowerCase().includes(query) ||
        String(appt.reason || "").toLowerCase().includes(query);
      const dateOk = !selectedDate || appt.date === selectedDate;
      const statusOk = statusFilter === "All" || appt.status === statusFilter;
      return searchOk && dateOk && statusOk;
    });
  }, [items, search, selectedDate, statusFilter]);

  /* ─── Weekly calendar ───────────────────────────────────────── */
  const weekDates = useMemo(() => {
    const base = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
    const day = base.getDay();
    const diff = (day + 6) % 7;
    const monday = new Date(base);
    monday.setDate(base.getDate() - diff);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      return { iso, dayName: d.toLocaleDateString(undefined, { weekday: 'short' }), dayNum: d.getDate() };
    });
  }, [selectedDate]);

  const apptsByDate = useMemo(() => {
    const map = {};
    items.forEach((a) => {
      const k = a.date || "";
      if (!k) return;
      if (!map[k]) map[k] = [];
      map[k].push(a);
    });
    Object.keys(map).forEach((k) => map[k].sort((a, b) => String(a.time || "").localeCompare(String(b.time || ""))));
    return map;
  }, [items]);

  /* ─── Form helpers ──────────────────────────────────────────── */
  const validate = () => {
    const next = {};
    const today = new Date().toISOString().split('T')[0];
    if (!form.patient?.trim()) next.patient = "Patient is required";
    if (!form.doctor?.trim()) next.doctor = "Doctor is required";
    if (!form.department?.trim()) next.department = "Department is required";
    if (!form.date) next.date = "Date is required";
    else if (form.date < today) next.date = "Past dates are not allowed";
    if (!form.time) next.time = "Time is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const generateToken = () => {
    const sameDate = items.filter((i) => i.date === form.date && i.status !== "Cancelled").length;
    return `TK-${form.date?.replaceAll("-", "")}-${String(sameDate + 1).padStart(3, "0")}`;
  };

  const handleBook = async () => {
    if (!validate()) return;
    const selectedPatient = patients.find((p) => p.name === form.patient);
    const selectedDoctor = doctors.find((d) => d.name === form.doctor);
    await createItem({
      ...form,
      patientId: selectedPatient?.id,
      doctorId: selectedDoctor?.id,
      token: generateToken(),
      queue: "-",
    });
    setForm(initialForm);
    setErrors({});
    setOpen(false);
  };

  const handleReschedule = async (appt) => {
    setReschedule({ id: appt.id, date: appt.date || "", time: appt.time || "" });
    setOpenReschedule(true);
  };

  const handleCancel = (appt) => {
    setApptToCancel(appt);
    setOpenCancel(true);
  };

  const confirmCancel = async () => {
    if (apptToCancel) {
      await updateItem(apptToCancel.id, { ...apptToCancel, status: "Cancelled" });
      setOpenCancel(false);
      setApptToCancel(null);
    }
  };

  const confirmReschedule = async () => {
    if (!reschedule.id || !reschedule.date || !reschedule.time) return;
    const today = new Date().toISOString().split('T')[0];
    if (reschedule.date < today) {
      alert("Past dates are not allowed for rescheduling.");
      return;
    }
    const appt = items.find((x) => x.id === reschedule.id);
    if (!appt) return;
    await updateItem(appt.id, { ...appt, date: reschedule.date, time: reschedule.time, status: "Rescheduled" });
    setOpenReschedule(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Scheduled': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'Rescheduled': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const statusOptions = ["All", "Scheduled", "Rescheduled", "Completed", "Cancelled"];

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900">Appointments</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage scheduling, tokens, and patient queues.
          </p>
        </div>
        <button type="button" className="btn-primary gap-2" onClick={() => setOpen(true)}>
          <Plus size={16} />
          Book Appointment
        </button>
      </div>

      {/* ── Metrics Summary ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard icon={CalendarDays} label="Total Appointments" value={metrics.total} color="text-blue-600" bgColor="bg-blue-50/60" borderColor="border-blue-100" />
        <MetricCard icon={CalendarClock} label="Scheduled" value={metrics.scheduled} color="text-indigo-600" bgColor="bg-indigo-50/60" borderColor="border-indigo-100" />
        <MetricCard icon={CheckCircle2} label="Completed" value={metrics.completed} color="text-emerald-600" bgColor="bg-emerald-50/60" borderColor="border-emerald-100" />
        <MetricCard icon={XCircle} label="Cancelled" value={metrics.cancelled} color="text-red-600" bgColor="bg-red-50/60" borderColor="border-red-100" />
        <MetricCard icon={TrendingUp} label="Today's Queue" value={metrics.today} color="text-amber-600" bgColor="bg-amber-50/60" borderColor="border-amber-100" />
      </div>

      {/* ── Toolbar ────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl shadow-soft border border-slate-100 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, doctor, reason or ID"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white"
          />
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white appearance-none"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "daily" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            onClick={() => setView("daily")}
          >
            List View
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "weekly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            onClick={() => setView("weekly")}
          >
            Weekly Widget
          </button>
        </div>
      </div>

      {/* ── Weekly Calendar Widget ────────────────────────────── */}
      {view === "weekly" && (
        <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center gap-2 text-slate-700 font-semibold">
            <CalendarDays size={18} className="text-brand-600" />
            Weekly Scheduling Overview
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 divide-x divide-y lg:divide-y-0 divide-slate-100">
            {weekDates.map((d) => {
              const list = (apptsByDate[d.iso] || []).filter((a) => a.status !== "Cancelled");
              const isSelected = selectedDate === d.iso;
              const isToday = d.iso === new Date().toISOString().slice(0, 10);
              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => {
                    setSelectedDate(d.iso);
                    setView("daily");
                  }}
                  className={`flex flex-col items-center justify-center p-6 transition-colors ${isSelected ? 'bg-brand-50' : isToday ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}
                >
                  <div className={`text-sm font-medium ${isSelected ? 'text-brand-700' : isToday ? 'text-blue-600' : 'text-slate-500'}`}>{d.dayName}</div>
                  <div className={`text-base font-bold my-1 ${isSelected ? 'text-brand-700' : isToday ? 'text-blue-700' : 'text-slate-800'}`}>{d.dayNum}</div>
                  {isToday && !isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mb-1" />}
                  {list.length > 0 ? (
                    <div className="mt-1 bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      {list.length} appts
                    </div>
                  ) : (
                    <div className="mt-1 text-slate-400 text-xs">No appts</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Appointment Table ─────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of {items.length} appointments
          </p>
          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate("")}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Clear date filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
             <CalendarDays size={48} className="text-slate-300 mb-4" />
             <p className="font-medium text-slate-700 text-base">No appointments found</p>
             <p className="text-xs">Try adjusting your filters or booking a new one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 uppercase text-sm font-semibold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Time & Date</th>
                  <th className="px-6 py-4 font-semibold">Patient Details</th>
                  <th className="px-6 py-4 font-semibold">Assigned Doctor</th>
                  <th className="px-6 py-4 font-semibold">Reason</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Token</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5"><Clock size={14} className="text-slate-400" />{appt.time || "-"}</span>
                        <span className="text-xs text-slate-500 mt-1">{appt.date || "-"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <User size={16} />
                         </div>
                         <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{appt.patient}</span>
                            <span className="text-xs text-slate-500 mt-0.5">ID: {appt.id}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <UserCog size={16} />
                         </div>
                         <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{appt.doctor}</span>
                            <span className="text-xs text-slate-500 mt-0.5">{appt.department || "-"}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle size={13} className="text-slate-400" />
                        <span className="text-slate-700 text-xs">{appt.reason || "-"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusBadge(appt.status)}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium font-mono">
                         <Ticket size={12} className="text-slate-400" />
                         {appt.token || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                          <button
                            type="button"
                            className="text-slate-400 hover:text-brand-600 transition-colors p-1"
                            title="Reschedule"
                            onClick={() => handleReschedule(appt)}
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                        {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                          <button
                            type="button"
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            title="Cancel Appointment"
                            onClick={() => handleCancel(appt)}
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        {(appt.status === 'Cancelled' || appt.status === 'Completed') && (
                          <span className="text-xs text-slate-400 italic">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Book Modal ────────────────────────────────────────── */}
      <AppModal open={open} title="Book Appointment" onClose={() => { setOpen(false); setErrors({}); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Patient Name" required error={errors.patient}>
            <select
              className="input-control"
              value={form.patient}
              onChange={(e) => { setForm((prev) => ({ ...prev, patient: e.target.value })); setErrors(p => ({...p, patient: null})); }}
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Doctor" required error={errors.doctor}>
            <select
              className="input-control"
              value={form.doctor}
              onChange={(e) => {
                const selected = doctors.find((d) => d.name === e.target.value);
                setForm((prev) => ({ ...prev, doctor: e.target.value, department: selected?.dept || prev.department }));
                setErrors(p => ({...p, doctor: null, department: null}));
              }}
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.specialization || d.dept})
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Department" required error={errors.department}>
            <input
              className="input-control"
              value={form.department}
              onChange={(e) => { setForm((prev) => ({ ...prev, department: e.target.value })); setErrors(p => ({...p, department: null})); }}
            />
          </FormField>
          <FormField label="Reason for Visit">
            <input
              className="input-control"
              value={form.reason}
              onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
            />
          </FormField>
          <FormField label="Date" required error={errors.date}>
            <input
              type="date"
              className="input-control"
              value={form.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => { setForm((prev) => ({ ...prev, date: e.target.value })); setErrors(p => ({...p, date: null})); }}
            />
          </FormField>
          <FormField label="Time" required error={errors.time}>
            <input
              type="time"
              className="input-control"
              value={form.time}
              onChange={(e) => { setForm((prev) => ({ ...prev, time: e.target.value })); setErrors(p => ({...p, time: null})); }}
            />
          </FormField>
          
          <div className="md:col-span-2 mt-2 bg-brand-50 border border-brand-100 rounded-lg p-3 flex items-start gap-3">
            <div className="bg-brand-100 p-1.5 rounded mt-0.5 text-brand-600"><Ticket size={16} /></div>
            <div>
               <p className="text-sm font-semibold text-brand-900">Token Generation</p>
               <p className="text-xs text-brand-700 mt-0.5">A unique queue token will be automatically generated and assigned once this appointment is confirmed.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => { setOpen(false); setErrors({}); }}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleBook}>
            Confirm Booking
          </button>
        </div>
      </AppModal>

      {/* ── Reschedule Modal ──────────────────────────────────── */}
      <AppModal open={openReschedule} title="Reschedule Appointment" onClose={() => setOpenReschedule(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="New Date" required>
            <input
              type="date"
              className="input-control"
              value={reschedule.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setReschedule((p) => ({ ...p, date: e.target.value }))}
            />
          </FormField>
          <FormField label="New Time" required>
            <input
              type="time"
              className="input-control"
              value={reschedule.time}
              onChange={(e) => setReschedule((p) => ({ ...p, time: e.target.value }))}
            />
          </FormField>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setOpenReschedule(false)}>Cancel</button>
          <button type="button" className="btn-primary" onClick={confirmReschedule}>
            Save Changes
          </button>
        </div>
      </AppModal>

      {/* ── Cancel Confirmation Modal ───────────────────────────── */}
      <AppModal open={openCancel} title="Cancel Appointment" onClose={() => setOpenCancel(false)}>
        <div className="py-4">
          <p className="text-slate-600">
            Are you sure you want to cancel the appointment for <span className="font-semibold text-slate-900">{apptToCancel?.patient}</span>?
          </p>
          <p className="text-sm text-slate-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setOpenCancel(false)}>No, Keep it</button>
          <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm" onClick={confirmCancel}>
            Yes, Cancel Appointment
          </button>
        </div>
      </AppModal>
    </div>
  );
}
