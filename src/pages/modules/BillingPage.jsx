import { useMemo, useState } from "react";
import { BadgeIndianRupee, FileText, Plus, Receipt, ShieldCheck, Undo2, Search, ArrowUpRight, ArrowDownRight, CreditCard, Clock } from "lucide-react";
import AppModal from "../../components/common/AppModal";
import FormField from "../../components/common/FormField";
import { useCrudModule } from "../../hooks/useCrudModule";

const initialInvoiceForm = {
  patient: "",
  category: "Consultation",
  amount: "",
  paymentMethod: "UPI",
  insuranceProvider: "",
  insurancePolicy: "",
  insuranceClaimStatus: "N/A",
};

export default function BillingPage() {
  const { items, loading, createItem, updateItem } = useCrudModule("billing");
  const { items: patients } = useCrudModule("patients");
  const { items: appointments } = useCrudModule("appointments");
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openCollect, setOpenCollect] = useState(false);
  const [openRefund, setOpenRefund] = useState(false);
  const [search, setSearch] = useState("");
  const [invoiceForm, setInvoiceForm] = useState(initialInvoiceForm);
  const [errors, setErrors] = useState({});
  const [txn, setTxn] = useState({ id: null, amount: "", method: "UPI" });
  const [refundTxn, setRefundTxn] = useState({ id: null, amount: "" });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (row) =>
        String(row.patient || "").toLowerCase().includes(q) ||
        String(row.id || "").toLowerCase().includes(q) ||
        String(row.status || "").toLowerCase().includes(q),
    );
  }, [items, search]);

  const totals = useMemo(() => {
    const total = filtered.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const paid = filtered.reduce((sum, row) => sum + Number(row.paid || 0), 0);
    const due = filtered.reduce((sum, row) => sum + Number(row.due || 0), 0);
    const refunded = filtered.reduce((sum, row) => sum + Number(row.refunded || 0), 0);
    return { total, paid, due, refunded };
  }, [filtered]);

  const validateInvoice = () => {
    const next = {};
    if (!invoiceForm.patient.trim()) next.patient = "Patient is required";
    if (!invoiceForm.amount || Number(invoiceForm.amount) <= 0) next.amount = "Valid amount is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onCreateInvoice = async () => {
    if (!validateInvoice()) return;
    const amount = Number(invoiceForm.amount);
    const selectedPatient = patients.find((p) => p.name === invoiceForm.patient);
    const linkedAppointment = appointments.find(
      (a) => a.patient === invoiceForm.patient && (a.status === "Completed" || a.status === "Scheduled" || a.status === "Rescheduled"),
    );
    await createItem({
      patient: invoiceForm.patient,
      patientId: selectedPatient?.id,
      appointmentId: linkedAppointment?.id || null,
      type: invoiceForm.category,
      date: new Date().toISOString().slice(0, 10),
      amount,
      paid: 0,
      due: amount,
      refunded: 0,
      status: "Unpaid",
      insuranceProvider: invoiceForm.insuranceProvider || "-",
      insurancePolicy: invoiceForm.insurancePolicy || "-",
      insuranceClaimStatus: invoiceForm.insuranceClaimStatus || "N/A",
      paymentMethods: "-",
    });
    setInvoiceForm(initialInvoiceForm);
    setErrors({});
    setOpenInvoice(false);
  };

  const onCollectPayment = async (row) => {
    setTxn({ id: row.id, amount: String(row.due || ""), method: "UPI" });
    setOpenCollect(true);
  };

  const onRefund = async (row) => {
    if (Number(row.paid || 0) <= 0) return;
    setRefundTxn({ id: row.id, amount: "0" });
    setOpenRefund(true);
  };

  const confirmCollect = async () => {
    const row = items.find((x) => x.id === txn.id);
    if (!row) return;
    const collect = Number(txn.amount);
    if (!Number.isFinite(collect) || collect <= 0) return;
    const paid = Number(row.paid || 0) + collect;
    const due = Math.max(0, Number(row.amount || 0) - paid);
    const status = due === 0 ? "Paid" : "Partial";
    const paymentMethods = row.paymentMethods && row.paymentMethods !== "-" ? `${row.paymentMethods}, ${txn.method}` : txn.method;
    await updateItem(row.id, { ...row, paid, due, status, paymentMethods });
    setOpenCollect(false);
  };

  const confirmRefund = async () => {
    const row = items.find((x) => x.id === refundTxn.id);
    if (!row) return;
    const refund = Number(refundTxn.amount);
    if (!Number.isFinite(refund) || refund <= 0) return;
    const refunded = Number(row.refunded || 0) + refund;
    const paid = Math.max(0, Number(row.paid || 0) - refund);
    const due = Math.max(0, Number(row.amount || 0) - paid);
    const status = paid === 0 ? "Unpaid" : due === 0 ? "Paid" : "Partial";
    await updateItem(row.id, { ...row, paid, due, refunded, status });
    setOpenRefund(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700';
      case 'Partial': return 'bg-amber-100 text-amber-700';
      case 'Unpaid': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900">Billing & Finance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Invoice generation, payments, insurance, and refunds.
          </p>
        </div>
        <button type="button" className="btn-primary gap-2" onClick={() => setOpenInvoice(true)}>
          <Plus size={16} />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-soft relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText size={48} className="text-blue-600" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Total Invoiced</div>
          <p className="text-base font-bold text-slate-900">₹{totals.total.toLocaleString()}</p>
          <div className="mt-3 text-xs text-blue-600 font-medium flex items-center gap-1">
            <ArrowUpRight size={14} /> +12% from last month
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl border border-emerald-200 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <BadgeIndianRupee size={48} className="text-emerald-600" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800 mb-1">Collected</div>
          <p className="text-base font-bold text-emerald-900">₹{totals.paid.toLocaleString()}</p>
          <div className="mt-3 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <ArrowUpRight size={14} /> Healthy collection rate
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Receipt size={48} className="text-amber-600" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide text-amber-800 mb-1">Pending Due</div>
          <p className="text-base font-bold text-amber-900">₹{totals.due.toLocaleString()}</p>
          <div className="mt-3 text-xs text-amber-700 font-medium flex items-center gap-1">
            <Clock size={14} /> Follow-up required
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-soft relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Undo2 size={48} className="text-red-600" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Refunded</div>
          <p className="text-base font-bold text-slate-900">₹{totals.refunded.toLocaleString()}</p>
          <div className="mt-3 text-xs text-red-600 font-medium flex items-center gap-1">
            <ArrowDownRight size={14} /> Decreased by 2%
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-2 rounded-lg text-brand-600">
              <ShieldCheck size={20} />
            </div>
            <h2 className="font-semibold text-slate-900 text-base">Financial Ledger</h2>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices or patients..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Receipt size={48} className="text-slate-300 mb-4" />
            <p className="font-medium text-slate-700 text-base">No invoices found</p>
            <p className="text-xs">Try adjusting your filters or creating a new invoice.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 uppercase text-sm font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Invoice Details</th>
                  <th className="px-6 py-4 font-semibold">Financials</th>
                  <th className="px-6 py-4 font-semibold">Insurance</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{row.id}</span>
                        <span className="font-medium text-brand-600 text-xs mt-0.5">{row.patient}</span>
                        <span className="text-xs text-slate-500 mt-1">{row.type} • {row.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between items-center w-32">
                          <span className="text-slate-500">Total:</span>
                          <span className="font-semibold text-slate-900">₹{Number(row.amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center w-32">
                          <span className="text-slate-500">Paid:</span>
                          <span className="font-semibold text-emerald-600">₹{Number(row.paid || 0).toLocaleString()}</span>
                        </div>
                        {Number(row.due) > 0 && (
                          <div className="flex justify-between items-center w-32">
                            <span className="text-slate-500">Due:</span>
                            <span className="font-bold text-amber-600">₹{Number(row.due || 0).toLocaleString()}</span>
                          </div>
                        )}
                        {Number(row.refunded) > 0 && (
                          <div className="flex justify-between items-center w-32">
                            <span className="text-slate-500">Ref:</span>
                            <span className="font-medium text-red-600">₹{Number(row.refunded || 0).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {row.insuranceProvider !== '-' ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700">{row.insuranceProvider}</span>
                           <span className="text-xs text-slate-500 mt-0.5">Pol: {row.insurancePolicy}</span>
                           <span className="text-xs uppercase font-bold text-blue-600 mt-1">{row.insuranceClaimStatus}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Self-Pay</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusBadge(row.status)}`}>
                          {row.status}
                        </span>
                        {row.paymentMethods !== '-' && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                            <CreditCard size={12} /> {row.paymentMethods}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        {row.status !== 'Paid' && (
                          <button
                            type="button"
                            className="text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded transition-colors w-24 text-center"
                            onClick={() => onCollectPayment(row)}
                          >
                            Collect
                          </button>
                        )}
                        {Number(row.paid) > 0 && (
                          <button
                            type="button"
                            className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors w-24 text-center"
                            onClick={() => onRefund(row)}
                          >
                            Refund
                          </button>
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

      <AppModal open={openInvoice} title="Generate Invoice" onClose={() => setOpenInvoice(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Patient Name" required error={errors.patient}>
            <select
              className="input-control"
              value={invoiceForm.patient}
              onChange={(e) => setInvoiceForm((prev) => ({ ...prev, patient: e.target.value }))}
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Billing Category">
            <select
              className="input-control"
              value={invoiceForm.category}
              onChange={(e) => setInvoiceForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option>Consultation</option>
              <option>Procedure</option>
              <option>Admission</option>
              <option>Pharmacy</option>
            </select>
          </FormField>
          <FormField label="Total Amount (₹)" required error={errors.amount}>
            <input
              type="number"
              className="input-control"
              value={invoiceForm.amount}
              onChange={(e) => setInvoiceForm((prev) => ({ ...prev, amount: e.target.value }))}
            />
          </FormField>
          <FormField label="Expected Payment Method">
            <select
              className="input-control"
              value={invoiceForm.paymentMethod}
              onChange={(e) => setInvoiceForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
            >
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
              <option>Insurance</option>
            </select>
          </FormField>

          <div className="md:col-span-2 mt-2 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Insurance Details (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Provider Name">
                <input
                  className="input-control"
                  value={invoiceForm.insuranceProvider}
                  onChange={(e) => setInvoiceForm((prev) => ({ ...prev, insuranceProvider: e.target.value }))}
                  placeholder="e.g. HealthCare Inc."
                />
              </FormField>
              <FormField label="Policy Number">
                <input
                  className="input-control"
                  value={invoiceForm.insurancePolicy}
                  onChange={(e) => setInvoiceForm((prev) => ({ ...prev, insurancePolicy: e.target.value }))}
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Initial Claim Status">
                  <select
                    className="input-control"
                    value={invoiceForm.insuranceClaimStatus}
                    onChange={(e) => setInvoiceForm((prev) => ({ ...prev, insuranceClaimStatus: e.target.value }))}
                  >
                    <option>N/A</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </FormField>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setOpenInvoice(false)}>Cancel</button>
          <button type="button" className="btn-primary" onClick={onCreateInvoice}>
            Create Invoice
          </button>
        </div>
      </AppModal>

      <AppModal open={openCollect} title="Collect Payment" onClose={() => setOpenCollect(false)}>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center">
            <span className="text-sm text-blue-700 font-medium">Pending Due Amount:</span>
            <span className="text-base font-bold text-blue-800">₹{txn.amount}</span>
          </div>
          <FormField label="Collection Amount (₹)" required>
            <input
              type="number"
              className="input-control text-sm font-semibold"
              value={txn.amount}
              onChange={(e) => setTxn((p) => ({ ...p, amount: e.target.value }))}
            />
          </FormField>
          <FormField label="Payment Method" required>
            <div className="grid grid-cols-3 gap-2">
              {['UPI', 'Cash', 'Card'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTxn(p => ({ ...p, method: m }))}
                  className={`py-2 text-sm font-medium rounded-lg border transition-colors ${txn.method === m ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </FormField>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setOpenCollect(false)}>Cancel</button>
          <button type="button" className="btn-primary" onClick={confirmCollect}>
            Confirm Payment
          </button>
        </div>
      </AppModal>

      <AppModal open={openRefund} title="Process Refund" onClose={() => setOpenRefund(false)}>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2">
            <ShieldCheck size={18} className="text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-800">Processing a refund will reverse the collected amount and update the invoice status accordingly. This action cannot be easily undone.</p>
          </div>
          <FormField label="Refund Amount (₹)" required>
            <input
              type="number"
              className="input-control text-sm font-semibold border-amber-200 focus:ring-amber-500"
              value={refundTxn.amount}
              onChange={(e) => setRefundTxn((p) => ({ ...p, amount: e.target.value }))}
            />
          </FormField>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setOpenRefund(false)}>Cancel</button>
          <button type="button" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-soft transition-colors" onClick={confirmRefund}>
            Issue Refund
          </button>
        </div>
      </AppModal>
    </div>
  );
}
