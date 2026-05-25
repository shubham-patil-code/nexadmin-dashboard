import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Users, Activity, Phone, FileText, Calendar, Droplets, MapPin, Building2, CreditCard } from "lucide-react";
import AppModal from "../../components/common/AppModal";
import FormField from "../../components/common/FormField";
import { useCrudModule } from "../../hooks/useCrudModule";
import { useSearchParams } from "react-router-dom";

const initialForm = {
  name: "",
  age: "",
  gender: "Male",
  contact: "",
  bloodGroup: "",
  address: "",
  history: "",
  diagnosis: "",
  prescriptions: "",
  dept: "General Medicine",
};

export default function PatientsPage() {
  const { items, loading, createItem } = useCrudModule("patients");
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setOpen(true);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (item) =>
        String(item.name || "").toLowerCase().includes(q) ||
        String(item.contact || "").toLowerCase().includes(q) ||
        String(item.id || "").toLowerCase().includes(q),
    );
  }, [items, search]);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Patient name is required";
    if (!form.age || Number(form.age) <= 0) next.age = "Valid age is required";
    if (!form.contact) {
      next.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(form.contact)) {
      next.contact = "Contact must be exactly 10 numeric digits";
    }
    if (!form.diagnosis.trim()) next.diagnosis = "Diagnosis is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    await createItem({
      ...form,
      age: Number(form.age),
      status: "Active",
    });
    setForm(initialForm);
    setErrors({});
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900">Patient Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registration, medical history, and clinical records.
          </p>
        </div>
        <button type="button" className="btn-primary gap-2" onClick={() => setOpen(true)}>
          <Plus size={16} />
          Register Patient
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-soft border border-slate-100 flex items-center gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, ID or contact"
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-100 shadow-soft hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-base flex-shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 text-base truncate pr-2">{p.name}</h3>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-700">
                      {p.status || "Active"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={13} /> {p.age || "-"} yrs</span>
                    <span>•</span>
                    <span>{p.gender || "-"}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-700">{p.id}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Activity size={12} /> Diagnosis
                  </div>
                  <p className="text-xs font-medium text-slate-800 line-clamp-2">
                    {p.diagnosis || "Under Evaluation"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Droplets size={12} /> Blood Group
                    </div>
                    <p className="text-xs font-medium text-red-600">
                      {p.bloodGroup || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Building2 size={12} /> Department
                    </div>
                    <p className="text-xs font-medium text-slate-700">
                      {p.dept || "General"}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone size={12} /> Contact
                  </div>
                  <p className="text-xs font-medium text-slate-700">
                    {p.contact || "N/A"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  View Profile
                </button>
                <button className="flex-1 px-3 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors flex items-center justify-center gap-1.5">
                  <FileText size={14} /> Records
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100 border-dashed">
              No patients found matching your search.
            </div>
          )}
        </div>
      )}

      <AppModal open={open} title="Patient Registration" onClose={() => setOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Full Name" required error={errors.name}>
            <input
              className="input-control"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </FormField>
          <FormField label="Age" required error={errors.age}>
            <input
              type="number"
              className="input-control"
              value={form.age}
              onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
            />
          </FormField>
          <FormField label="Gender">
            <select
              className="input-control"
              value={form.gender}
              onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </FormField>
          <FormField label="Contact" required error={errors.contact}>
            <input
              className="input-control"
              value={form.contact}
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                setForm((prev) => ({ ...prev, contact: digits }));
                if (errors.contact)
                  setErrors((prev) => ({ ...prev, contact: undefined }));
              }}
            />
          </FormField>
          <FormField label="Blood Group">
            <select
              className="input-control"
              value={form.bloodGroup}
              onChange={(e) => setForm((prev) => ({ ...prev, bloodGroup: e.target.value }))}
            >
              <option value="">Select...</option>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>O+</option><option>O-</option>
              <option>AB+</option><option>AB-</option>
            </select>
          </FormField>
          <FormField label="Department">
            <select
              className="input-control"
              value={form.dept}
              onChange={(e) => setForm((prev) => ({ ...prev, dept: e.target.value }))}
            >
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Orthopedics</option>
              <option>General Medicine</option>
            </select>
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Primary Diagnosis" required error={errors.diagnosis}>
              <input
                className="input-control"
                value={form.diagnosis}
                onChange={(e) => setForm((prev) => ({ ...prev, diagnosis: e.target.value }))}
                placeholder="Initial diagnosis or reason for visit"
              />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <FormField label="Medical History">
              <textarea
                rows={2}
                className="input-control"
                value={form.history}
                onChange={(e) => setForm((prev) => ({ ...prev, history: e.target.value }))}
              />
            </FormField>
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setOpen(false)}>Cancel</button>
          <button type="button" className="btn-primary" onClick={onSubmit}>
            Register Patient
          </button>
        </div>
      </AppModal>
    </div>
  );
}
