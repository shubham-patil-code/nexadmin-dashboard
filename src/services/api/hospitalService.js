import { httpRequest } from "./httpClient";

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const useMockApi = process.env.REACT_APP_USE_MOCK_API !== "false";

const store = {
  departments: [
    { id: "D001", department_name: "Cardiology" },
    { id: "D002", department_name: "Neurology" },
    { id: "D003", department_name: "Orthopedics" },
    { id: "D004", department_name: "General Medicine" },
  ],
  suppliers: [
    { id: "SUP001", name: "MedCorp", contact: "9000000001" },
    { id: "SUP002", name: "BioPharm", contact: "9000000002" },
  ],
  doctors: [
    { id: "DOC001", name: "Dr. Arjun Mehta", specialization: "Cardiologist", phone: "9898989898", email: "arjun@hospital.test", department_id: "D001", availability: "09:00-14:00" },
    { id: "DOC002", name: "Dr. Neha Singh", specialization: "Neurologist", phone: "9877777777", email: "neha@hospital.test", department_id: "D002", availability: "10:00-16:00" },
    { id: "DOC003", name: "Dr. Rohit Patel", specialization: "Orthopedic Surgeon", phone: "9866666666", email: "rohit@hospital.test", department_id: "D003", availability: "08:00-13:00" },
    { id: "DOC004", name: "Dr. Kavita Rao", specialization: "General Physician", phone: "9855555555", email: "kavita@hospital.test", department_id: "D004", availability: "09:00-17:00" },
  ],
  patients: [
    { id: "P001", name: "Aarav Sharma", age: 34, gender: "Male", contact: "9876543210", department_id: "D001", status: "Active", history: "Hypertension (5y).", diagnosis: "Coronary Artery Disease - requires monitoring.", prescriptions: "Aspirin 75mg OD", documents: "ECG.pdf", familyMembers: 1 },
    { id: "P002", name: "Priya Patel", age: 28, gender: "Female", contact: "9812345678", department_id: "D002", status: "Active", history: "Migraine episodes.", diagnosis: "Chronic Migraine", prescriptions: "Sumatriptan PRN", documents: "-", familyMembers: 0 },
    { id: "P003", name: "Suresh Kumar", age: 52, gender: "Male", contact: "9834567890", department_id: "D003", status: "Active", history: "Knee replacement candidate.", diagnosis: "Osteoarthritis - bilateral knee", prescriptions: "Diclofenac 50mg BD", documents: "X-Ray.pdf", familyMembers: 3 },
    { id: "P004", name: "Anjali Desai", age: 41, gender: "Female", contact: "9845678901", department_id: "D004", status: "Active", history: "Diabetes Type 2.", diagnosis: "Uncontrolled diabetes - HbA1c 8.2", prescriptions: "Metformin 500mg BD", documents: "LabReport.pdf", familyMembers: 2 },
    { id: "P005", name: "Rahul Verma", age: 25, gender: "Male", contact: "9856789012", department_id: "D001", status: "Active", history: "No significant history.", diagnosis: "Palpitations - stress related", prescriptions: "Propranolol 20mg SOS", documents: "-", familyMembers: 0 },
    { id: "P006", name: "Meera Iyer", age: 63, gender: "Female", contact: "9867890123", department_id: "D002", status: "Active", history: "Post-stroke rehabilitation.", diagnosis: "Ischemic stroke - recovering", prescriptions: "Clopidogrel 75mg OD", documents: "MRI.pdf", familyMembers: 4 },
  ],
  staff: [
    { id: "S001", name: "Dr. Arjun Mehta", role: "Doctor", specialization: "Cardiologist", dept: "Cardiology", availability: "09:00 AM - 02:00 PM", status: "Available", contact: "+91 98989 89898", email: "arjun.m@hospital.test" },
    { id: "S002", name: "Dr. Neha Singh", role: "Doctor", specialization: "Neurologist", dept: "Neurology", availability: "10:00 AM - 04:00 PM", status: "Available", contact: "+91 98777 77777", email: "neha.s@hospital.test" },
    { id: "S003", name: "Nurse Pooja Nair", role: "Head Nurse", specialization: "ICU Care", dept: "General Medicine", availability: "08:00 AM - 04:00 PM", status: "On Leave", contact: "+91 98666 66666", email: "pooja.n@hospital.test" },
    { id: "S004", name: "Ramesh Kumar", role: "Technician", specialization: "Radiology Tech", dept: "Radiology", availability: "Shift: Night", status: "Available", contact: "+91 98555 55555", email: "ramesh.k@hospital.test" },
    { id: "S005", name: "Dr. Rohit Patel", role: "Doctor", specialization: "Orthopedic Surgeon", dept: "Orthopedics", availability: "08:00 AM - 01:00 PM", status: "Available", contact: "+91 98666 66655", email: "rohit.p@hospital.test" },
    { id: "S006", name: "Dr. Kavita Rao", role: "Doctor", specialization: "General Physician", dept: "General Medicine", availability: "09:00 AM - 05:00 PM", status: "Available", contact: "+91 98555 55544", email: "kavita.r@hospital.test" },
  ],
  appointments: [
    { id: "A001", patient_id: "P001", doctor_id: "DOC001", department_id: "D001", appointment_date: "2026-05-07", time: "10:00", status: "Completed", token: "TK-20260507-001", reason: "Follow-up" },
    { id: "A002", patient_id: "P002", doctor_id: "DOC002", department_id: "D002", appointment_date: "2026-05-08", time: "11:30", status: "Scheduled", token: "TK-20260508-001", reason: "Consultation" },
    { id: "A003", patient_id: "P003", doctor_id: "DOC003", department_id: "D003", appointment_date: "2026-05-08", time: "09:00", status: "Scheduled", token: "TK-20260508-002", reason: "Pre-surgery assessment" },
    { id: "A004", patient_id: "P004", doctor_id: "DOC004", department_id: "D004", appointment_date: "2026-05-08", time: "14:00", status: "Scheduled", token: "TK-20260508-003", reason: "Diabetes review" },
    { id: "A005", patient_id: "P005", doctor_id: "DOC001", department_id: "D001", appointment_date: "2026-05-08", time: "10:30", status: "Rescheduled", token: "TK-20260508-004", reason: "Cardiac check-up" },
    { id: "A006", patient_id: "P006", doctor_id: "DOC002", department_id: "D002", appointment_date: "2026-05-07", time: "15:00", status: "Completed", token: "TK-20260507-002", reason: "Neurological follow-up" },
    { id: "A007", patient_id: "P001", doctor_id: "DOC001", department_id: "D001", appointment_date: "2026-05-09", time: "09:30", status: "Scheduled", token: "TK-20260509-001", reason: "ECG review" },
    { id: "A008", patient_id: "P003", doctor_id: "DOC003", department_id: "D003", appointment_date: "2026-05-06", time: "11:00", status: "Cancelled", token: "TK-20260506-001", reason: "X-Ray consultation" },
    { id: "A009", patient_id: "P004", doctor_id: "DOC004", department_id: "D004", appointment_date: "2026-05-06", time: "16:00", status: "Completed", token: "TK-20260506-002", reason: "Lab results discussion" },
    { id: "A010", patient_id: "P005", doctor_id: "DOC001", department_id: "D001", appointment_date: "2026-05-09", time: "11:00", status: "Scheduled", token: "TK-20260509-002", reason: "Stress test" },
  ],
  billing: [
    { id: "INV001", patient_id: "P001", appointment_id: "A001", type: "Consultation", date: "2026-05-07", total_amount: 12500, paid: 12500, due: 0, refunded: 0, payment_status: "Paid", payment_method: "UPI", insuranceProvider: "-", insurancePolicy: "-", insuranceClaimStatus: "N/A" },
    { id: "INV002", patient_id: "P002", appointment_id: "A002", type: "OPD", date: "2026-05-07", total_amount: 8200, paid: 5000, due: 3200, refunded: 0, payment_status: "Partial", payment_method: "Card", insuranceProvider: "ABC Insurance", insurancePolicy: "POL-112233", insuranceClaimStatus: "Pending" },
  ],
  inventory: [
    { id: "M001", item_name: "Paracetamol 500mg", category: "Medicine", quantity: 1200, minStock: 200, supplier_id: "SUP001", purchaseDate: "2026-04-22", purchaseQty: 1000, purchaseCost: 2500 },
    { id: "M002", item_name: "Insulin 100IU", category: "Medicine", quantity: 28, minStock: 50, supplier_id: "SUP002", purchaseDate: "2026-04-15", purchaseQty: 60, purchaseCost: 7200 },
  ],
  reports: [],
  notifications: [
    { id: "N001", type: "warning", title: "Low Stock Alert", message: "Insulin 100IU is below minimum stock level in Main Pharmacy.", timestamp: "10 mins ago", read: false },
    { id: "N002", type: "success", title: "Payment Received", message: "₹12,500 received from Aarav Sharma (UPI).", timestamp: "1 hour ago", read: false },
    { id: "N003", type: "error", title: "Equipment Failure", message: "MRI Machine #2 in Radiology is reporting an error code E-404.", timestamp: "2 hours ago", read: false },
    { id: "N004", type: "info", title: "Staff Meeting", message: "Monthly department head meeting scheduled for 3:00 PM today.", timestamp: "3 hours ago", read: true },
    { id: "N005", type: "warning", title: "High Occupancy", message: "ICU bed occupancy has exceeded 90% capacity.", timestamp: "5 hours ago", read: true },
  ],
};

const prefixes = {
  departments: "D",
  suppliers: "SUP",
  doctors: "DOC",
  patients: "P",
  appointments: "A",
  staff: "S",
  billing: "INV",
  inventory: "M",
  reports: "R",
  notifications: "N",
};

const nextId = (moduleKey) => {
  const prefix = prefixes[moduleKey];
  const len = String(store[moduleKey].length + 1).padStart(3, "0");
  return `${prefix}${len}`;
};

const byId = (list, id) => list.find((row) => row.id === id);
const deptName = (departmentId) => byId(store.departments, departmentId)?.department_name || "-";
const doctorName = (doctorId) => byId(store.doctors, doctorId)?.name || "-";
const patientName = (patientId) => byId(store.patients, patientId)?.name || "-";
const supplierName = (supplierId) => byId(store.suppliers, supplierId)?.name || "-";

const toPatientView = (p) => ({
  ...p,
  dept: deptName(p.department_id),
});

const toAppointmentView = (a) => ({
  ...a,
  patientId: a.patient_id,
  doctorId: a.doctor_id,
  departmentId: a.department_id,
  patient: patientName(a.patient_id),
  doctor: doctorName(a.doctor_id),
  department: deptName(a.department_id),
  date: a.appointment_date,
});

const toBillingView = (b) => ({
  ...b,
  patientId: b.patient_id,
  appointmentId: b.appointment_id,
  patient: patientName(b.patient_id),
  amount: b.total_amount,
  status: b.payment_status,
  paymentMethods: b.payment_method || "-",
});

const toInventoryView = (i) => ({
  ...i,
  name: i.item_name,
  stock: i.quantity,
  vendor: supplierName(i.supplier_id),
});

const getReportsView = () => {
  const totalRevenue = store.billing.reduce((sum, b) => sum + Number(b.paid || 0), 0);
  const due = store.billing.reduce((sum, b) => sum + Number(b.due || 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = store.appointments.filter((a) => a.appointment_date === today).length;
  return [
    { id: "R001", title: "Total Revenue Collected", value: `INR ${totalRevenue.toLocaleString()}`, trend: "Operational" },
    { id: "R002", title: "Outstanding Due", value: `INR ${due.toLocaleString()}`, trend: "Monitor" },
    { id: "R003", title: "Patients Registered", value: String(store.patients.length), trend: "Live" },
    { id: "R004", title: "Today Appointments", value: String(todayAppointments), trend: "Daily" },
  ];
};

const toView = (moduleKey, rows) => {
  switch (moduleKey) {
    case "patients":
      return rows.map(toPatientView);
    case "appointments":
      return rows.map(toAppointmentView);
    case "billing":
      return rows.map(toBillingView);
    case "inventory":
      return rows.map(toInventoryView);
    case "reports":
      return getReportsView();
    default:
      return [...rows];
  }
};

const normalizeCreatePayload = (moduleKey, payload) => {
  if (moduleKey === "patients") {
    const departmentId =
      payload.department_id ||
      payload.departmentId ||
      store.departments.find((d) => d.department_name === payload.dept)?.id ||
      "D004";
    return { ...payload, department_id: departmentId };
  }
  if (moduleKey === "appointments") {
    const patientId =
      payload.patient_id ||
      payload.patientId ||
      store.patients.find((p) => p.name === payload.patient)?.id;
    const doctorId =
      payload.doctor_id ||
      payload.doctorId ||
      store.doctors.find((d) => d.name === payload.doctor)?.id;
    const departmentId =
      payload.department_id ||
      payload.departmentId ||
      (doctorId ? byId(store.doctors, doctorId)?.department_id : null) ||
      store.departments.find((d) => d.department_name === payload.department)?.id ||
      "D004";
    return { ...payload, patient_id: patientId, doctor_id: doctorId, department_id: departmentId, appointment_date: payload.date || payload.appointment_date };
  }
  if (moduleKey === "billing") {
    const patientId =
      payload.patient_id ||
      payload.patientId ||
      store.patients.find((p) => p.name === payload.patient)?.id;
    return {
      ...payload,
      patient_id: patientId,
      appointment_id: payload.appointment_id || payload.appointmentId || null,
      total_amount: Number(payload.total_amount ?? payload.amount ?? 0),
      payment_status: payload.status || payload.payment_status || "Unpaid",
      payment_method: payload.paymentMethods || payload.payment_method || "-",
    };
  }
  if (moduleKey === "inventory") {
    let supplierId = payload.supplier_id || payload.supplierId;
    if (!supplierId) {
      const existing = store.suppliers.find((s) => s.name === payload.vendor);
      if (existing) {
        supplierId = existing.id;
      } else if (payload.vendor) {
        supplierId = nextId("suppliers");
        store.suppliers.push({ id: supplierId, name: payload.vendor, contact: "-" });
      } else {
        supplierId = "SUP001";
      }
    }
    return {
      ...payload,
      item_name: payload.item_name || payload.name,
      quantity: Number(payload.quantity ?? payload.stock ?? 0),
      supplier_id: supplierId,
    };
  }
  return payload;
};

const normalizeUpdatePayload = (moduleKey, payload) => normalizeCreatePayload(moduleKey, payload);

export const hospitalService = {
  async list(moduleKey) {
    if (!useMockApi) return httpRequest(`/${moduleKey}`);
    await wait();
    return toView(moduleKey, store[moduleKey] || []);
  },
  async create(moduleKey, payload) {
    if (!useMockApi) return httpRequest(`/${moduleKey}`, { method: "POST", body: JSON.stringify(payload) });
    await wait();
    const normalized = normalizeCreatePayload(moduleKey, payload);
    const record = { ...normalized, id: nextId(moduleKey) };
    store[moduleKey].push(record);
    return toView(moduleKey, [record])[0];
  },
  async update(moduleKey, id, payload) {
    if (!useMockApi) return httpRequest(`/${moduleKey}/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    await wait();
    const normalized = normalizeUpdatePayload(moduleKey, payload);
    store[moduleKey] = store[moduleKey].map((row) => (row.id === id ? { ...row, ...normalized } : row));
    return toView(moduleKey, [store[moduleKey].find((row) => row.id === id)])[0];
  },
  async remove(moduleKey, id) {
    if (!useMockApi) return httpRequest(`/${moduleKey}/${id}`, { method: "DELETE" });
    await wait();
    store[moduleKey] = store[moduleKey].filter((row) => row.id !== id);
    return { success: true };
  },
};
