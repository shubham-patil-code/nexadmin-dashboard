import { useEffect, useMemo, useState } from "react";
import { useCrudModule } from "../../hooks/useCrudModule";
import { Plus, Search, User, Phone, Mail, Clock, Briefcase, UserCog } from "lucide-react";
import AppModal from "../../components/common/AppModal";
import FormField from "../../components/common/FormField";

const initialForm = {
  name: "",
  role: "Doctor",
  specialization: "",
  dept: "Cardiology",
  availability: "",
  contact: "",
  email: "",
  status: "Available"
};

export default function StaffPage() {
  const { items, loading, createItem } = useCrudModule("staff");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const filtered = useMemo(() => {
    let result = items;
    if (filterRole !== "All") {
      result = result.filter(r => r.role === filterRole);
    }
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (item) =>
          String(item.name || "").toLowerCase().includes(q) ||
          String(item.specialization || "").toLowerCase().includes(q) ||
          String(item.dept || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, search, filterRole]);

  const onSubmit = async () => {
    const next = {};
    if (!form.name?.trim()) next.name = "Full Name is required";
    if (!form.role) next.role = "Role is required";
    if (!form.dept) next.dept = "Department is required";
    
    if (!form.contact) {
      next.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(form.contact)) {
      next.contact = "Contact number must be exactly 10 digits";
    }

    if (!form.email) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Invalid email format";
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    await createItem(form);
    setOpen(false);
    setForm(initialForm);
    setErrors({});
  };

  const roles = ["All", "Doctor", "Head Nurse", "Nurse", "Technician", "Admin"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900">Doctors & Staff</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage hospital personnel, availability, and contact information.
          </p>
        </div>
        <button type="button" className="btn-primary gap-2" onClick={() => {
          setForm(initialForm);
          setErrors({});
          setOpen(true);
        }}>
          <Plus size={16} />
          Add Staff Member
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-soft border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, department, specialization..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filterRole === role
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(staff => (
            <div key={staff.id} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className={`h-24 w-full relative ${staff.role === 'Doctor' ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                staff.role?.includes('Nurse') ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                  'bg-gradient-to-r from-violet-500 to-purple-500'
                }`}>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/30 text-white text-xs font-medium">
                  {staff.status}
                </div>
              </div>

              <div className="px-5 pb-5 relative">
                <div className="h-16 w-16 bg-white rounded-full p-1 border border-slate-100 shadow-md absolute -top-8 left-5">
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    {staff.role === 'Doctor' ? <User size={28} /> : <UserCog size={28} />}
                  </div>
                </div>

                <div className="pt-10">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">{staff.name}</h3>
                  <div className="text-xs font-semibold text-brand-600 mt-1">{staff.specialization || staff.role}</div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Briefcase size={14} className="text-slate-400" />
                      {staff.dept}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock size={14} className="text-slate-400" />
                      {staff.availability || "Standard Hours"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone size={14} className="text-slate-400" />
                      {staff.contact || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
                      <Mail size={14} className="text-slate-400" />
                      <span className="truncate">{staff.email || "N/A"}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">View Profile</button>
                    <button className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Message</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100 border-dashed">
              No staff members found matching your search.
            </div>
          )}
        </div>
      )}

      <AppModal open={open} title="Add Staff Member" onClose={() => { setOpen(false); setErrors({}); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Full Name" required error={errors.name}>
            <input className="input-control" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors(p => ({...p, name: null})); }} placeholder="Dr. John Doe" />
          </FormField>
          <FormField label="Role" required error={errors.role}>
            <select className="input-control" value={form.role} onChange={e => { setForm({ ...form, role: e.target.value }); setErrors(p => ({...p, role: null})); }}>
              <option>Doctor</option>
              <option>Head Nurse</option>
              <option>Nurse</option>
              <option>Technician</option>
              <option>Admin</option>
            </select>
          </FormField>
          <FormField label="Specialization">
            <input className="input-control" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="e.g. Cardiologist" />
          </FormField>
          <FormField label="Department" required error={errors.dept}>
            <select className="input-control" value={form.dept} onChange={e => { setForm({ ...form, dept: e.target.value }); setErrors(p => ({...p, dept: null})); }}>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Orthopedics</option>
              <option>General Medicine</option>
              <option>Radiology</option>
            </select>
          </FormField>
          <FormField label="Availability">
            <input className="input-control" value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} placeholder="e.g. 09:00 AM - 05:00 PM" />
          </FormField>
          <FormField label="Status">
            <select className="input-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Available</option>
              <option>On Leave</option>
              <option>In Surgery</option>
            </select>
          </FormField>
          <FormField label="Contact Number" required error={errors.contact}>
            <input 
              type="text"
              maxLength="10"
              className="input-control" 
              value={form.contact} 
              onChange={e => { 
                const val = e.target.value.replace(/\D/g, '');
                setForm({ ...form, contact: val }); 
                setErrors(p => ({...p, contact: null})); 
              }} 
              placeholder="9876543210" 
            />
          </FormField>
          <FormField label="Email Address" required error={errors.email}>
            <input type="email" className="input-control" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setErrors(p => ({...p, email: null})); }} placeholder="john.doe@hospital.com" />
          </FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => { setOpen(false); setErrors({}); }}>Cancel</button>
          <button type="button" className="btn-primary" onClick={onSubmit}>Save Staff</button>
        </div>
      </AppModal>
    </div>
  );
}
